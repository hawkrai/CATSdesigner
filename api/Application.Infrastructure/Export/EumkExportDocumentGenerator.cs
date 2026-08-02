using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
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
using A = DocumentFormat.OpenXml.Drawing;
using DW = DocumentFormat.OpenXml.Drawing.Wordprocessing;
using PIC = DocumentFormat.OpenXml.Drawing.Pictures;

namespace Application.Infrastructure.Export
{
    public sealed class EumkExportDocumentGenerator
    {
        private static readonly string[] CyrillicOptionLetters =
        {
            "а", "б", "в", "г", "д", "е", "ж", "з", "и", "к",
            "л", "м", "н", "о", "п", "р", "с", "т", "у", "ф"
        };

        private static readonly string[] ImageExtensions = { ".png", ".jpg", ".jpeg", ".gif", ".bmp" };

        private const string DocumentFontName = "Arial";
        private const ushort BodyHalfPoints = 22;
        private const uint PageWidthTwips = 11906;
        private const uint PageHeightTwips = 16838;
        private const uint PageMarginTwips = 1000;

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
                        foreach (var child in SortChildren(root.Children))
                        {
                            AppendConcept(body, mainPart, child, depth: 1, hiddenTestIds, testQuestionsHeading);
                        }
                    }

                    EnsureUniqueDrawingIds(body);
                    AppendSectionProperties(body);
                }

                return ms.ToArray();
            }
        }

        private void AppendConcept(
            Body body,
            MainDocumentPart mainPart,
            Concept node,
            int depth,
            ISet<int> hiddenTestIds,
            string testQuestionsHeading)
        {
            if (node == null)
            {
                return;
            }

            if (node.Test != null && hiddenTestIds != null && hiddenTestIds.Contains(node.Test.Id))
            {
                return;
            }

            const bool startsNewPage = true;

            if (node.Test != null)
            {
                AppendSectionHeading(body, node.Name, depth, startsNewPage, TestHeadingHalfPoints(depth));
                var test = _testsManagementService.GetTestWithAnswers(node.Test.Id);
                if (test == null)
                {
                    AppendParagraph(body, "—", italic: true);
                    return;
                }

                AppendParagraph(body, testQuestionsHeading, bold: true, fontHalfPoints: 24);
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

            AppendSectionHeading(body, node.Name, depth, startsNewPage, SectionHeadingHalfPoints(depth));

            if (!node.IsGroup && !string.IsNullOrEmpty(node.Container))
            {
                var attachments = _filesManagementService.GetAttachments(node.Container)?.ToList() ?? new List<Attachment>();
                foreach (var a in attachments)
                {
                    AppendAttachmentContent(body, mainPart, a);
                }
            }

            if (node.Children != null && node.Children.Any())
            {
                foreach (var child in SortChildren(node.Children))
                {
                    AppendConcept(body, mainPart, child, depth + 1, hiddenTestIds, testQuestionsHeading);
                }
            }
        }

        private void AppendAttachmentContent(Body body, MainDocumentPart mainPart, Attachment a)
        {
            var path = _filesManagementService.GetFullPath(a);
            if (string.IsNullOrWhiteSpace(path) || !File.Exists(path))
            {
                return;
            }

            var ext = (Path.GetExtension(path) ?? string.Empty).ToLowerInvariant();

            var sourceDocx = FindRetainedSourceDocx(path);
            var docxToEmbed = sourceDocx ?? (ext == ".docx" ? path : null);
            if (docxToEmbed != null)
            {
                try
                {
                    EumkAttachmentTextExtractor.AppendDocxAsAltChunk(body, mainPart, docxToEmbed);
                    return;
                }
                catch
                {
                    try
                    {
                        EumkAttachmentTextExtractor.AppendDocxBodyElements(body, mainPart, docxToEmbed);
                        return;
                    }
                    catch
                    {
                    }
                }
            }

            if (IsImageExtension(ext))
            {
                try
                {
                    AppendImage(body, mainPart, path);
                    return;
                }
                catch
                {
                }
            }
            foreach (var line in EumkAttachmentTextExtractor.ExtractParagraphLines(path))
            {
                AppendParagraph(body, line, fontHalfPoints: BodyHalfPoints, justification: JustificationValues.Both);
            }
        }

        private static void AppendQuestionBlock(Body body, int index, Question q)
        {
            var title = QuestionTitle(index, q.Title);
            AppendParagraph(body, title, bold: true, fontHalfPoints: 24);
            foreach (var line in DescriptionLines(q.Description))
            {
                AppendParagraph(body, line, fontHalfPoints: 22);
            }

            var options = GetAnswerOptions(q);
            var i = 0;
            foreach (var option in options)
            {
                AppendParagraph(
                    body,
                    OptionLabel(i++) + ") " + SanitizeForWord(option),
                    fontHalfPoints: 22,
                    justification: JustificationValues.Both,
                    indentLeftTwips: 360);
            }
        }
        public byte[] BuildPdf(
            Concept root,
            string documentTitle,
            string testQuestionsHeading,
            ISet<int> hiddenTestIds)
        {
            if (root == null)
            {
                throw new ArgumentNullException(nameof(root));
            }

            var baseFont = TryCreateUnicodeFont();
            var chunks = new List<byte[]>();
            var title = string.IsNullOrWhiteSpace(documentTitle) ? root.Name : documentTitle;
            chunks.Add(BuildCoverChunkPdf(title, root, baseFont));

            if (root.Children != null && root.Children.Any())
            {
                foreach (var child in SortChildren(root.Children))
                {
                    CollectPdfChunks(chunks, child, 1, hiddenTestIds, testQuestionsHeading, baseFont);
                }
            }

            return MergePdfChunks(chunks);
        }

        private void CollectPdfChunks(
            List<byte[]> chunks,
            Concept node,
            int depth,
            ISet<int> hiddenTestIds,
            string testQuestionsHeading,
            BaseFont baseFont)
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

                chunks.Add(BuildTestChunkPdf(node, depth, testQuestionsHeading, baseFont));
                return;
            }

            var pdfPaths = new List<string>();
            var imagePaths = new List<string>();
            var textOnly = new List<Attachment>();

            if (!node.IsGroup && !string.IsNullOrEmpty(node.Container))
            {
                var attachments = _filesManagementService.GetAttachments(node.Container)?.ToList() ?? new List<Attachment>();
                foreach (var a in attachments)
                {
                    var path = _filesManagementService.GetFullPath(a);
                    if (string.IsNullOrWhiteSpace(path) || !File.Exists(path))
                    {
                        continue;
                    }

                    var ext = (Path.GetExtension(path) ?? string.Empty).ToLowerInvariant();
                    if (ext == ".pdf")
                    {
                        pdfPaths.Add(path);
                    }
                    else if (IsImageExtension(ext))
                    {
                        imagePaths.Add(path);
                    }
                    else
                    {
                        textOnly.Add(a);
                    }
                }
            }

            chunks.Add(BuildHeadingChunkPdf(node.Name, depth, imagePaths, textOnly, baseFont));
            foreach (var pdfPath in pdfPaths)
            {
                var bytes = SafeReadAllBytes(pdfPath);
                if (bytes != null && bytes.Length > 0)
                {
                    chunks.Add(bytes);
                }
            }

            if (node.Children != null && node.Children.Any())
            {
                foreach (var child in SortChildren(node.Children))
                {
                    CollectPdfChunks(chunks, child, depth + 1, hiddenTestIds, testQuestionsHeading, baseFont);
                }
            }
        }

        private static byte[] BuildCoverChunkPdf(string title, Concept root, BaseFont baseFont)
        {
            return RenderPdfChunk(doc =>
            {
                var fontTitle = new Font(baseFont, 22f, Font.BOLD);
                var fontSubtitle = new Font(baseFont, 13f, Font.ITALIC);

                doc.Add(new iTextSharp.text.Paragraph(SanitizeForWord(title), fontTitle)
                {
                    Alignment = iTextSharp.text.Element.ALIGN_CENTER,
                    SpacingBefore = 140f,
                });

                if (root.Subject != null && !string.IsNullOrWhiteSpace(root.Subject.Name))
                {
                    doc.Add(new iTextSharp.text.Paragraph(SanitizeForWord(root.Subject.Name), fontSubtitle)
                    {
                        Alignment = iTextSharp.text.Element.ALIGN_CENTER,
                        SpacingBefore = 20f,
                    });
                }
            });
        }

        private byte[] BuildHeadingChunkPdf(
            string name,
            int depth,
            List<string> imagePaths,
            List<Attachment> textOnly,
            BaseFont baseFont)
        {
            return RenderPdfChunk(doc =>
            {
                var fontHeading = new Font(baseFont, Math.Max(12f, 18f - depth * 1.5f), Font.BOLD);
                doc.Add(new iTextSharp.text.Paragraph(SanitizeForWord(name), fontHeading)
                {
                    Alignment = depth == 1 ? iTextSharp.text.Element.ALIGN_CENTER : iTextSharp.text.Element.ALIGN_LEFT,
                    SpacingAfter = 10f,
                });

                foreach (var imagePath in imagePaths)
                {
                    try
                    {
                        var img = iTextSharp.text.Image.GetInstance(imagePath);
                        img.Alignment = iTextSharp.text.Element.ALIGN_CENTER;
                        img.ScaleToFit(doc.PageSize.Width - 100f, doc.PageSize.Height - 120f);
                        doc.Add(img);
                    }
                    catch
                    {
                    }
                }

                foreach (var a in textOnly)
                {
                    var fontBody = new Font(baseFont, 11f, Font.NORMAL);
                    foreach (var line in GetAttachmentContentLines(a))
                    {
                        doc.Add(new iTextSharp.text.Paragraph(SanitizeForWord(line), fontBody)
                        {
                            Alignment = iTextSharp.text.Element.ALIGN_JUSTIFIED,
                            SpacingAfter = 2f,
                        });
                    }
                }
            });
        }

        private byte[] BuildTestChunkPdf(Concept node, int depth, string testQuestionsHeading, BaseFont baseFont)
        {
            return RenderPdfChunk(doc =>
            {
                var fontHeading = new Font(baseFont, Math.Max(12f, 16f - depth), Font.BOLD);
                doc.Add(new iTextSharp.text.Paragraph(SanitizeForWord(node.Name), fontHeading)
                {
                    Alignment = depth == 1 ? iTextSharp.text.Element.ALIGN_CENTER : iTextSharp.text.Element.ALIGN_LEFT,
                    SpacingAfter = 6f,
                });

                var test = _testsManagementService.GetTestWithAnswers(node.Test.Id);
                if (test == null)
                {
                    doc.Add(new iTextSharp.text.Paragraph("—", new Font(baseFont, 11f, Font.ITALIC)));
                    return;
                }

                doc.Add(new iTextSharp.text.Paragraph(SanitizeForWord(testQuestionsHeading), new Font(baseFont, 12f, Font.BOLD))
                {
                    SpacingAfter = 4f,
                });

                var questions = (test.Questions ?? Enumerable.Empty<Question>())
                    .OrderBy(q => q.QuestionNumber ?? q.Id)
                    .ToList();
                if (questions.Count == 0)
                {
                    doc.Add(new iTextSharp.text.Paragraph("—", new Font(baseFont, 11f, Font.ITALIC)));
                    return;
                }

                var n = 1;
                foreach (var q in questions)
                {
                    var title = QuestionTitle(n, q.Title);
                    doc.Add(new iTextSharp.text.Paragraph(title, new Font(baseFont, 12f, Font.BOLD))
                    {
                        SpacingBefore = 6f,
                        SpacingAfter = 2f,
                    });

                    foreach (var line in DescriptionLines(q.Description))
                    {
                        doc.Add(new iTextSharp.text.Paragraph(line, new Font(baseFont, 11f, Font.NORMAL))
                        {
                            Alignment = iTextSharp.text.Element.ALIGN_JUSTIFIED,
                            SpacingAfter = 2f,
                        });
                    }

                    var options = GetAnswerOptions(q);
                    var i = 0;
                    foreach (var option in options)
                    {
                        doc.Add(new iTextSharp.text.Paragraph(OptionLabel(i++) + ") " + SanitizeForWord(option), new Font(baseFont, 11f, Font.NORMAL))
                        {
                            IndentationLeft = 18f,
                            SpacingAfter = 1f,
                        });
                    }

                    n++;
                }
            });
        }

        private static byte[] RenderPdfChunk(Action<PdfDocument> fill)
        {
            using (var ms = new MemoryStream())
            {
                var doc = new PdfDocument(iTextSharp.text.PageSize.A4, 50, 50, 50, 50);
                PdfWriter.GetInstance(doc, ms);
                doc.Open();
                fill(doc);
                doc.Close();
                return ms.ToArray();
            }
        }

        private static byte[] MergePdfChunks(List<byte[]> chunks)
        {
            PdfReader.unethicalreading = true;
            using (var ms = new MemoryStream())
            {
                var doc = new PdfDocument();
                using (var copy = new PdfSmartCopy(doc, ms))
                {
                    doc.Open();
                    foreach (var chunk in chunks)
                    {
                        if (chunk == null || chunk.Length == 0)
                        {
                            continue;
                        }

                        PdfReader reader = null;
                        try
                        {
                            reader = new PdfReader(chunk);
                        }
                        catch
                        {
                            continue;
                        }

                        try
                        {
                            var pageCount = reader.NumberOfPages;
                            for (var page = 1; page <= pageCount; page++)
                            {
                                copy.AddPage(copy.GetImportedPage(reader, page));
                            }
                        }
                        catch
                        {
                        }
                        finally
                        {
                            reader.Close();
                        }
                    }

                    doc.Close();
                }

                return ms.ToArray();
            }
        }

        private static byte[] SafeReadAllBytes(string path)
        {
            try
            {
                return File.ReadAllBytes(path);
            }
            catch
            {
                return null;
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


        private static List<string> GetAnswerOptions(Question q)
        {
            if (q.Answers == null || q.QuestionType == QuestionType.TextAnswer)
            {
                return new List<string>();
            }

            return q.Answers
                .OrderBy(a => a.Id)
                .Select(a => HtmlToPlainText(a.Content ?? string.Empty))
                .Where(c => !string.IsNullOrWhiteSpace(c))
                .ToList();
        }

        private static string QuestionTitle(int index, string rawTitle)
        {
            var text = SanitizeForWord(HtmlToPlainText(rawTitle));
            return string.IsNullOrWhiteSpace(text) ? $"Вопрос {index}" : $"{index}. {text}";
        }

        private static IEnumerable<string> DescriptionLines(string description)
        {
            if (string.IsNullOrWhiteSpace(description))
            {
                yield break;
            }

            foreach (var line in SplitLines(HtmlToPlainText(description)))
            {
                var clean = SanitizeForWord(line);
                if (!string.IsNullOrWhiteSpace(clean))
                {
                    yield return clean;
                }
            }
        }

        private static string HtmlToPlainText(string html)
        {
            if (string.IsNullOrEmpty(html))
            {
                return string.Empty;
            }

            var text = html;
            text = Regex.Replace(text, "<(script|style)[^>]*>.*?</\\1>", " ",
                RegexOptions.IgnoreCase | RegexOptions.Singleline);
            text = Regex.Replace(text, "<br\\s*/?>", "\n", RegexOptions.IgnoreCase);
            text = Regex.Replace(text, "</(p|div|li|h[1-6]|tr|td|th|blockquote)\\s*>", "\n", RegexOptions.IgnoreCase);
            text = Regex.Replace(text, "<(p|div|li|h[1-6]|tr|blockquote)[^>]*>", "\n", RegexOptions.IgnoreCase);
            text = Regex.Replace(text, "<[^>]+>", string.Empty);
            text = System.Net.WebUtility.HtmlDecode(text);
            text = text.Replace(' ', ' ');
            text = Regex.Replace(text, "[ \\t\\f\\v]+", " ");
            text = Regex.Replace(text, "\\n{3,}", "\n\n");
            return text.Trim();
        }

        private static string OptionLabel(int index)
        {
            if (index >= 0 && index < CyrillicOptionLetters.Length)
            {
                return CyrillicOptionLetters[index];
            }

            return (index + 1).ToString();
        }

        private static bool IsImageExtension(string ext)
        {
            return !string.IsNullOrEmpty(ext) && ImageExtensions.Contains(ext);
        }

        private static string FindRetainedSourceDocx(string attachmentPath)
        {
            try
            {
                var ext = (Path.GetExtension(attachmentPath) ?? string.Empty).ToLowerInvariant();
                if (ext != ".pdf")
                {
                    return null;
                }

                var dir = Path.GetDirectoryName(attachmentPath);
                if (string.IsNullOrEmpty(dir))
                {
                    return null;
                }

                var candidate = Path.Combine(dir, Path.GetFileNameWithoutExtension(attachmentPath) + ".docx");
                return File.Exists(candidate) ? candidate : null;
            }
            catch
            {
                return null;
            }
        }

        private IEnumerable<string> GetAttachmentContentLines(Attachment a)
        {
            var path = _filesManagementService.GetFullPath(a);
            return EumkAttachmentTextExtractor.ExtractParagraphLines(path);
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
                    new SpacingBetweenLines { Before = "2800", After = "200" },
                    new Justification { Val = JustificationValues.Center }),
                new Run(
                    BuildRunProperties(bold: true, italic: false, fontHalfPoints: 44),
                    new Text(SanitizeForWord(text)) { Space = SpaceProcessingModeValues.Preserve }));
            body.AppendChild(p);
        }

        private static ushort SectionHeadingHalfPoints(int depth)
        {
            return (ushort)Math.Max(24, 36 - depth * 3);
        }

        private static ushort TestHeadingHalfPoints(int depth)
        {
            return (ushort)Math.Max(24, 32 - depth * 2);
        }

        private static void AppendSectionHeading(
            Body body,
            string text,
            int depth,
            bool pageBreakBefore,
            ushort fontHalfPoints)
        {
            var jc = depth == 1 ? JustificationValues.Center : JustificationValues.Left;

            var pp = new ParagraphProperties();

            pp.AppendChild(new KeepNext());
            if (pageBreakBefore)
            {
                pp.AppendChild(new PageBreakBefore());
            }

            pp.AppendChild(new SpacingBetweenLines { Before = depth <= 1 ? "360" : "240", After = "200" });
            pp.AppendChild(new Justification { Val = jc });
            pp.AppendChild(new OutlineLevel { Val = Math.Min(depth - 1, 8) });

            var p = new Paragraph(
                pp,
                new Run(
                    BuildRunProperties(bold: true, italic: false, fontHalfPoints: fontHalfPoints),
                    new Text(SanitizeForWord(text)) { Space = SpaceProcessingModeValues.Preserve }));
            body.AppendChild(p);
        }

        private static RunProperties BuildRunProperties(bool bold, bool italic, ushort fontHalfPoints)
        {
            var rp = new RunProperties(
                new RunFonts
                {
                    Ascii = DocumentFontName,
                    HighAnsi = DocumentFontName,
                    ComplexScript = DocumentFontName,
                });

            if (bold)
            {
                rp.AppendChild(new Bold());
            }

            if (italic)
            {
                rp.AppendChild(new Italic());
            }

            rp.AppendChild(new FontSize { Val = fontHalfPoints.ToString() });
            rp.AppendChild(new FontSizeComplexScript { Val = fontHalfPoints.ToString() });
            return rp;
        }

        private static void AppendSectionProperties(Body body)
        {
            body.AppendChild(new SectionProperties(
                new PageSize { Width = PageWidthTwips, Height = PageHeightTwips },
                new PageMargin
                {
                    Top = (int)PageMarginTwips,
                    Right = PageMarginTwips,
                    Bottom = (int)PageMarginTwips,
                    Left = PageMarginTwips,
                    Header = 0U,
                    Footer = 0U,
                    Gutter = 0U,
                }));
        }

        private static void AppendParagraph(
            Body body,
            string text,
            bool bold = false,
            bool italic = false,
            bool isSubtitle = false,
            ushort fontHalfPoints = 24,
            JustificationValues? justification = JustificationValues.Both,
            int indentLeftTwips = 0)
        {
            var rp = BuildRunProperties(
                bold,
                italic || isSubtitle,
                isSubtitle ? (ushort)26 : fontHalfPoints);

            var pp = new ParagraphProperties(new SpacingBetweenLines { After = "80" });
            if (indentLeftTwips > 0)
            {
                pp.AppendChild(new Indentation { Left = indentLeftTwips.ToString() });
            }

            if (justification.HasValue)
            {
                pp.AppendChild(new Justification { Val = justification.Value });
            }

            var p = new Paragraph(
                pp,
                new Run(rp, new Text(SanitizeForWord(text)) { Space = SpaceProcessingModeValues.Preserve }));
            body.AppendChild(p);
        }

        private void AppendImage(Body body, MainDocumentPart mainPart, string imagePath)
        {
            var ext = (Path.GetExtension(imagePath) ?? string.Empty).ToLowerInvariant();
            var imagePart = mainPart.AddImagePart(ImagePartTypeFromExtension(ext));
            using (var stream = File.OpenRead(imagePath))
            {
                imagePart.FeedData(stream);
            }

            var relId = mainPart.GetIdOfPart(imagePart);
            GetImageEmu(imagePath, out var widthEmu, out var heightEmu);

            body.AppendChild(new Paragraph(
                new ParagraphProperties(new Justification { Val = JustificationValues.Center }),
                new Run(BuildImageDrawing(relId, widthEmu, heightEmu))));
        }

        private static ImagePartType ImagePartTypeFromExtension(string ext)
        {
            switch (ext)
            {
                case ".png":
                    return ImagePartType.Png;
                case ".gif":
                    return ImagePartType.Gif;
                case ".bmp":
                    return ImagePartType.Bmp;
                default:
                    return ImagePartType.Jpeg;
            }
        }

        private static void GetImageEmu(string path, out long widthEmu, out long heightEmu)
        {
            const long maxWidthEmu = 5486400L;
            double widthPx = 600;
            double heightPx = 400;

            try
            {
                var img = iTextSharp.text.Image.GetInstance(path);
                if (img.Width > 0 && img.Height > 0)
                {
                    widthPx = img.Width;
                    heightPx = img.Height;
                }
            }
            catch
            {
            }

            var w = widthPx / 96.0 * 914400.0;
            var h = heightPx / 96.0 * 914400.0;
            if (w > maxWidthEmu)
            {
                var scale = maxWidthEmu / w;
                w *= scale;
                h *= scale;
            }

            widthEmu = (long)w;
            heightEmu = (long)h;
        }

        private static DocumentFormat.OpenXml.Wordprocessing.Drawing BuildImageDrawing(string relationshipId, long widthEmu, long heightEmu)
        {
            return new DocumentFormat.OpenXml.Wordprocessing.Drawing(
                new DW.Inline(
                    new DW.Extent { Cx = widthEmu, Cy = heightEmu },
                    new DW.EffectExtent { LeftEdge = 0L, TopEdge = 0L, RightEdge = 0L, BottomEdge = 0L },
                    new DW.DocProperties { Id = 1U, Name = "Picture" },
                    new DW.NonVisualGraphicFrameDrawingProperties(new A.GraphicFrameLocks { NoChangeAspect = true }),
                    new A.Graphic(
                        new A.GraphicData(
                            new PIC.Picture(
                                new PIC.NonVisualPictureProperties(
                                    new PIC.NonVisualDrawingProperties { Id = 0U, Name = "Image" },
                                    new PIC.NonVisualPictureDrawingProperties()),
                                new PIC.BlipFill(
                                    new A.Blip { Embed = relationshipId, CompressionState = A.BlipCompressionValues.Print },
                                    new A.Stretch(new A.FillRectangle())),
                                new PIC.ShapeProperties(
                                    new A.Transform2D(
                                        new A.Offset { X = 0L, Y = 0L },
                                        new A.Extents { Cx = widthEmu, Cy = heightEmu }),
                                    new A.PresetGeometry(new A.AdjustValueList()) { Preset = A.ShapeTypeValues.Rectangle })))
                        { Uri = "http://schemas.openxmlformats.org/drawingml/2006/picture" }))
                {
                    DistanceFromTop = 0U,
                    DistanceFromBottom = 0U,
                    DistanceFromLeft = 0U,
                    DistanceFromRight = 0U,
                });
        }

        private static void EnsureUniqueDrawingIds(Body body)
        {
            uint id = 1;
            foreach (var docProps in body.Descendants<DW.DocProperties>())
            {
                docProps.Id = id++;
            }
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
