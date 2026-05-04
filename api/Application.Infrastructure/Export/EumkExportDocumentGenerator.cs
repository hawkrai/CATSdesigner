using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using Application.Infrastructure.FilesManagement;
using Application.Infrastructure.KnowledgeTestsManagement;
using LMPlatform.Models;
using LMPlatform.Models.KnowledgeTesting;

namespace Application.Infrastructure.Export
{
    public sealed class EumkExportDocumentGenerator
    {
        private readonly IFilesManagementService _filesManagementService;
        private readonly ITestsManagementService _testsManagementService;

        public EumkExportDocumentGenerator(
            IFilesManagementService filesManagementService,
            ITestsManagementService testsManagementService)
        {
            _filesManagementService = filesManagementService;
            _testsManagementService = testsManagementService;
        }

        public byte[] BuildDocx(
            Concept root,
            string documentTitle,
            string testQuestionsHeading,
            string attachedMaterialsHeading,
            ISet<int> hiddenTestIds)
        {
            if (root == null)
            {
                throw new ArgumentNullException(nameof(root));
            }

            using (var ms = new MemoryStream())
            {
                using (var wordDocument = WordprocessingDocument.Create(ms, WordprocessingDocumentType.Document, true))
                {
                    var mainPart = wordDocument.AddMainDocumentPart();
                    mainPart.Document = new Document(new Body());

                    var body = mainPart.Document.Body;

                    AppendTitle(body, string.IsNullOrWhiteSpace(documentTitle) ? root.Name : documentTitle);
                    if (root.Subject != null && !string.IsNullOrWhiteSpace(root.Subject.Name))
                    {
                        AppendParagraph(body, root.Subject.Name, isSubtitle: true);
                    }

                    body.AppendChild(new Paragraph(new Run(new Break())));

                    if (root.Children != null && root.Children.Any())
                    {
                        foreach (var child in SortChildren(root.Children))
                        {
                            AppendConcept(body, child, depth: 1, hiddenTestIds, testQuestionsHeading, attachedMaterialsHeading);
                        }
                    }
                }

                return ms.ToArray();
            }
        }

        private void AppendConcept(
            Body body,
            Concept node,
            int depth,
            ISet<int> hiddenTestIds,
            string testQuestionsHeading,
            string attachedMaterialsHeading)
        {
            if (node == null)
            {
                return;
            }

            if (node.Test != null)
            {
                if (hiddenTestIds != null && hiddenTestIds.Contains(node.Test.Id))
                {
                    return;
                }

                AppendSectionHeading(body, node.Name, depth);
                var test = _testsManagementService.GetTest(node.Test.Id, true);
                if (test == null)
                {
                    AppendParagraph(body, "—", italic: true);
                    return;
                }

                AppendParagraph(body, testQuestionsHeading, bold: true, fontHalfPoints: (ushort)(22 + Math.Min(depth, 3) * 2));
                var questions = (test.Questions ?? Enumerable.Empty<Question>())
                    .OrderBy(q => q.QuestionNumber ?? q.Id)
                    .ToList();
                if (questions.Count == 0)
                {
                    AppendParagraph(body, "—", italic: true);
                }
                else
                {
                    var n = 1;
                    foreach (var q in questions)
                    {
                        AppendQuestionBlock(body, n++, q);
                    }
                }

                return;
            }

            AppendSectionHeading(body, node.Name, depth);

            if (!node.IsGroup && !string.IsNullOrEmpty(node.Container))
            {
                var attachments = _filesManagementService.GetAttachments(node.Container)?.ToList() ?? new List<Attachment>();
                if (attachments.Count > 0)
                {
                    AppendParagraph(body, attachedMaterialsHeading, bold: true, fontHalfPoints: 22);
                    foreach (var a in attachments)
                    {
                        var label = !string.IsNullOrWhiteSpace(a.Name) ? a.Name : a.FileName;
                        AppendBullet(body, label);
                    }
                }
            }

            if (node.Children != null && node.Children.Any())
            {
                foreach (var child in SortChildren(node.Children))
                {
                    AppendConcept(body, child, depth + 1, hiddenTestIds, testQuestionsHeading, attachedMaterialsHeading);
                }
            }
        }

        private static void AppendQuestionBlock(Body body, int index, Question q)
        {
            var title = SanitizeForWord(string.IsNullOrWhiteSpace(q.Title) ? $"Вопрос {index}" : $"{index}. {q.Title}");
            AppendParagraph(body, title, bold: true, fontHalfPoints: 22);
            if (!string.IsNullOrWhiteSpace(q.Description))
            {
                foreach (var line in SplitLines(q.Description))
                {
                    AppendParagraph(body, SanitizeForWord(line), fontHalfPoints: 22);
                }
            }
        }

        private static IEnumerable<string> SplitLines(string text)
        {
            if (string.IsNullOrEmpty(text))
            {
                yield break;
            }

            var parts = text.Replace("\r\n", "\n").Split('\n');
            foreach (var p in parts)
            {
                yield return p.TrimEnd('\r');
            }
        }

        private static List<Concept> SortChildren(IEnumerable<Concept> children)
        {
            var list = children?.Where(c => c != null).ToList() ?? new List<Concept>();
            if (list.Count <= 1)
            {
                return list;
            }

            var first = list.FirstOrDefault(c => c.PrevConcept == null);
            if (first == null)
            {
                return list;
            }

            var res = new List<Concept> { first };
            var guard = 0;
            while (first.NextConcept.HasValue && guard++ < 2000)
            {
                var next = list.FirstOrDefault(c => c.Id == first.NextConcept.Value);
                if (next == null || res.Any(r => r.Id == next.Id))
                {
                    break;
                }

                res.Add(next);
                first = next;
            }

            foreach (var c in list.Where(c => res.All(r => r.Id != c.Id)))
            {
                res.Add(c);
            }

            return res;
        }

        private static void AppendTitle(Body body, string text)
        {
            var p = new Paragraph(
                new ParagraphProperties(
                    new Justification { Val = JustificationValues.Center },
                    new SpacingBetweenLines { After = "200" }),
                new Run(
                    new RunProperties(
                        new Bold(),
                        new FontSize { Val = "56" }),
                    new Text(SanitizeForWord(text)) { Space = SpaceProcessingModeValues.Preserve }));
            body.AppendChild(p);
        }

        private static void AppendSectionHeading(Body body, string text, int depth)
        {
            var size = (ushort)Math.Max(28, 40 - depth * 4);
            var p = new Paragraph(
                new ParagraphProperties(
                    new SpacingBetweenLines { Before = depth <= 1 ? "360" : "240", After = "120" }),
                new Run(
                    new RunProperties(new Bold(), new FontSize { Val = size.ToString() }),
                    new Text(SanitizeForWord(text)) { Space = SpaceProcessingModeValues.Preserve }));
            body.AppendChild(p);
        }

        private static void AppendParagraph(
            Body body,
            string text,
            bool bold = false,
            bool italic = false,
            bool isSubtitle = false,
            ushort fontHalfPoints = 24)
        {
            var rp = new RunProperties();
            if (isSubtitle)
            {
                rp.AppendChild(new Italic());
                rp.AppendChild(new FontSize { Val = "28" });
            }
            else
            {
                rp.AppendChild(new FontSize { Val = fontHalfPoints.ToString() });
            }

            if (bold)
            {
                rp.AppendChild(new Bold());
            }

            if (italic && !isSubtitle)
            {
                rp.AppendChild(new Italic());
            }

            var p = new Paragraph(
                new ParagraphProperties(new SpacingBetweenLines { After = "80" }),
                new Run(rp, new Text(SanitizeForWord(text)) { Space = SpaceProcessingModeValues.Preserve }));
            body.AppendChild(p);
        }

        private static void AppendBullet(Body body, string text)
        {
            var p = new Paragraph(
                new ParagraphProperties(
                    new SpacingBetweenLines { After = "40" },
                    new Indentation { Left = "360", Hanging = "360" }),
                new Run(
                    new RunProperties(new FontSize { Val = "22" }),
                    new Text("• " + SanitizeForWord(text)) { Space = SpaceProcessingModeValues.Preserve }));
            body.AppendChild(p);
        }

        private static string SanitizeForWord(string s)
        {
            if (string.IsNullOrEmpty(s))
            {
                return string.Empty;
            }

            return new string(s.Select(ch =>
            {
                if (ch == '\t' || ch == '\n' || ch == '\r')
                {
                    return ' ';
                }

                return char.IsControl(ch) ? ' ' : ch;
            }).ToArray()).Trim();
        }
    }
}
