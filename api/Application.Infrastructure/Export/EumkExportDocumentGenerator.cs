using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using Application.Infrastructure.FilesManagement;
using Application.Infrastructure.KnowledgeTestsManagement;
using iTextSharp.text.pdf;
using LMPlatform.Models;
using LMPlatform.Models.KnowledgeTesting;
using Font = iTextSharp.text.Font;
using PdfDocument = iTextSharp.text.Document;

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
                    mainPart.Document = new DocumentFormat.OpenXml.Wordprocessing.Document(new Body());

                    var body = mainPart.Document.Body;

                    AppendTitle(body, string.IsNullOrWhiteSpace(documentTitle) ? root.Name : documentTitle);
                    if (root.Subject != null && !string.IsNullOrWhiteSpace(root.Subject.Name))
                    {
                        AppendParagraph(body, root.Subject.Name, isSubtitle: true, justification: JustificationValues.Center);
                    }

                    if (root.Children != null && root.Children.Any())
                    {
                        var topLevel = SortChildren(root.Children);
                        AppendPageBreak(body);
                        var i = 0;
                        foreach (var child in topLevel)
                        {
                            if (i++ > 0)
                            {
                                AppendPageBreak(body);
                            }

                            AppendConcept(body, child, depth: 1, hiddenTestIds, testQuestionsHeading, attachedMaterialsHeading);
                        }
                    }
                }

                return ms.ToArray();
            }
        }

        public byte[] BuildPdfFallback(
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
                var doc = new iTextSharp.text.Document(iTextSharp.text.PageSize.A4, 50, 50, 50, 50);
                PdfWriter.GetInstance(doc, ms);
                doc.Open();

                var baseFont = TryCreateUnicodeFont();
                var fontTitle = new Font(baseFont, 18f, Font.BOLD);
                var fontSubtitle = new Font(baseFont, 12f, Font.ITALIC);
                var fontHeading = new Font(baseFont, 14f, Font.BOLD);
                var fontBody = new Font(baseFont, 11f, Font.NORMAL);

                var title = string.IsNullOrWhiteSpace(documentTitle) ? root.Name : documentTitle;
                doc.Add(new iTextSharp.text.Paragraph(SanitizeForWord(title), fontTitle) { Alignment = iTextSharp.text.Element.ALIGN_CENTER });
                if (root.Subject != null && !string.IsNullOrWhiteSpace(root.Subject.Name))
                {
                    doc.Add(new iTextSharp.text.Paragraph(SanitizeForWord(root.Subject.Name), fontSubtitle) { Alignment = iTextSharp.text.Element.ALIGN_CENTER, SpacingAfter = 12f });
                }

                if (root.Children != null && root.Children.Any())
                {
                    var topLevel = SortChildren(root.Children);
                    var i = 0;
                    foreach (var child in topLevel)
                    {
                        if (i++ > 0)
                        {
                            doc.NewPage();
                        }

                        AppendConceptPdf(doc, child, 1, hiddenTestIds, testQuestionsHeading, attachedMaterialsHeading, baseFont, fontHeading, fontBody);
                    }
                }

                doc.Close();
                return ms.ToArray();
            }
        }

        private static BaseFont TryCreateUnicodeFont()
        {
            try
            {
                var windir = Environment.GetFolderPath(Environment.SpecialFolder.Windows);
                if (!string.IsNullOrEmpty(windir))
                {
                    foreach (var rel in new[] { @"Fonts\arial.ttf", @"Fonts\arialuni.ttf", @"Fonts\calibri.ttf" })
                    {
                        var p = Path.Combine(windir, rel);
                        if (File.Exists(p))
                        {
                            return BaseFont.CreateFont(p, BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
                        }
                    }
                }
            }
            catch
            {
            }

            return BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
        }

        private void AppendConceptPdf(
            PdfDocument doc,
            Concept node,
            int depth,
            ISet<int> hiddenTestIds,
            string testQuestionsHeading,
            string attachedMaterialsHeading,
            BaseFont baseFont,
            Font fontHeading,
            Font fontBody)
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

                doc.Add(new iTextSharp.text.Paragraph(SanitizeForWord(node.Name), fontHeading)
                {
                    Alignment = depth == 1 ? iTextSharp.text.Element.ALIGN_CENTER : iTextSharp.text.Element.ALIGN_JUSTIFIED,
                    SpacingBefore = 8f,
                    SpacingAfter = 4f,
                });
                var test = _testsManagementService.GetTest(node.Test.Id, true);
                if (test == null)
                {
                    doc.Add(new iTextSharp.text.Paragraph("—", new Font(baseFont, 11f, Font.ITALIC)) { Alignment = iTextSharp.text.Element.ALIGN_JUSTIFIED });
                    return;
                }

                doc.Add(new iTextSharp.text.Paragraph(testQuestionsHeading, new Font(baseFont, 12f, Font.BOLD)) { Alignment = iTextSharp.text.Element.ALIGN_JUSTIFIED, SpacingAfter = 4f });
                var questions = (test.Questions ?? Enumerable.Empty<Question>())
                    .OrderBy(q => q.QuestionNumber ?? q.Id)
                    .ToList();
                if (questions.Count == 0)
                {
                    doc.Add(new iTextSharp.text.Paragraph("—", new Font(baseFont, 11f, Font.ITALIC)) { Alignment = iTextSharp.text.Element.ALIGN_JUSTIFIED });
                }
                else
                {
                    var n = 1;
                    foreach (var q in questions)
                    {
                        AppendQuestionBlockPdf(doc, n++, q, baseFont);
                    }
                }

                return;
            }

            doc.Add(new iTextSharp.text.Paragraph(SanitizeForWord(node.Name), fontHeading)
            {
                Alignment = depth == 1 ? iTextSharp.text.Element.ALIGN_CENTER : iTextSharp.text.Element.ALIGN_JUSTIFIED,
                SpacingBefore = depth <= 1 ? 6f : 4f,
                SpacingAfter = 4f,
            });

            if (!node.IsGroup && !string.IsNullOrEmpty(node.Container))
            {
                var attachments = _filesManagementService.GetAttachments(node.Container)?.ToList() ?? new List<Attachment>();
                if (attachments.Count > 0)
                {
                    doc.Add(new iTextSharp.text.Paragraph(attachedMaterialsHeading, new Font(baseFont, 12f, Font.BOLD)) { Alignment = iTextSharp.text.Element.ALIGN_JUSTIFIED, SpacingAfter = 4f });
                    foreach (var a in attachments)
                    {
                        var label = !string.IsNullOrWhiteSpace(a.Name) ? a.Name : a.FileName;
                        doc.Add(new iTextSharp.text.Paragraph("• " + SanitizeForWord(label), fontBody) { Alignment = iTextSharp.text.Element.ALIGN_JUSTIFIED });
                        foreach (var line in GetAttachmentContentLines(a))
                        {
                            doc.Add(new iTextSharp.text.Paragraph(SanitizeForWord(line), new Font(baseFont, 10.5f, Font.NORMAL)) { SpacingAfter = 2f });
                        }
                    }
                }
            }

            if (node.Children != null && node.Children.Any())
            {
                foreach (var child in SortChildren(node.Children))
                {
                    AppendConceptPdf(doc, child, depth + 1, hiddenTestIds, testQuestionsHeading, attachedMaterialsHeading, baseFont, fontHeading, fontBody);
                }
            }
        }

        private static void AppendQuestionBlockPdf(PdfDocument doc, int index, Question q, BaseFont baseFont)
        {
            var title = SanitizeForWord(string.IsNullOrWhiteSpace(q.Title) ? $"Вопрос {index}" : $"{index}. {q.Title}");
            doc.Add(new iTextSharp.text.Paragraph(title, new Font(baseFont, 12f, Font.BOLD)) { Alignment = iTextSharp.text.Element.ALIGN_JUSTIFIED, SpacingAfter = 2f });
            if (!string.IsNullOrWhiteSpace(q.Description))
            {
                foreach (var line in SplitLines(q.Description))
                {
                    doc.Add(new iTextSharp.text.Paragraph(SanitizeForWord(line), new Font(baseFont, 11f, Font.NORMAL)) { Alignment = iTextSharp.text.Element.ALIGN_JUSTIFIED, SpacingAfter = 2f });
                }
            }
        }

        private IEnumerable<string> GetAttachmentContentLines(Attachment a)
        {
            var path = _filesManagementService.GetFullPath(a);
            return EumkAttachmentTextExtractor.ExtractParagraphLines(path);
        }

        private void AppendAttachmentExtractedContent(Body body, Attachment a)
        {
            var path = _filesManagementService.GetFullPath(a);
            if (string.IsNullOrWhiteSpace(path) || !File.Exists(path))
            {
                return;
            }

            var ext = (Path.GetExtension(path) ?? string.Empty).ToLowerInvariant();
            if (ext == ".docx")
            {
                try
                {
                    EumkAttachmentTextExtractor.AppendDocxBodyElements(body, path);
                    return;
                }
                catch
                {
                }
            }

            var lines = EumkAttachmentTextExtractor.ExtractParagraphLines(path).ToList();
            if (lines.Count == 0)
            {
                return;
            }

            AppendParagraph(body, "Содержимое:", bold: true, fontHalfPoints: 20, justification: null);
            foreach (var line in lines)
            {
                AppendParagraph(body, line, fontHalfPoints: 20, justification: null);
            }
        }

        private static void AppendPageBreak(Body body)
        {
            body.AppendChild(
                new Paragraph(
                    new Run(new Break { Type = BreakValues.Page })));
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
                        AppendAttachmentExtractedContent(body, a);
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
            var jc = depth == 1 ? JustificationValues.Center : JustificationValues.Both;
            var p = new Paragraph(
                new ParagraphProperties(
                    new Justification { Val = jc },
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
            ushort fontHalfPoints = 24,
            JustificationValues? justification = JustificationValues.Both)
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

            var pp = new ParagraphProperties(new SpacingBetweenLines { After = "80" });
            if (justification.HasValue)
            {
                pp.AppendChild(new Justification { Val = justification.Value });
            }

            var p = new Paragraph(
                pp,
                new Run(rp, new Text(SanitizeForWord(text)) { Space = SpaceProcessingModeValues.Preserve }));
            body.AppendChild(p);
        }

        private static void AppendBullet(Body body, string text)
        {
            var p = new Paragraph(
                new ParagraphProperties(
                    new Justification { Val = JustificationValues.Both },
                    new SpacingBetweenLines { After = "40" }),
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
