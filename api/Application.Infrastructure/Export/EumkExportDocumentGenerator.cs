using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using Application.Core.PdfConvertor;
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
        private static readonly string[] TextExtensions = { ".docx", ".txt", ".csv", ".md", ".htm", ".html" };
        private static readonly string[] NotEmbeddableDocumentExtensions = { ".doc", ".rtf" };
        private static readonly string[] LayoutSensitiveExtensions = { ".pdf", ".doc", ".rtf" };
        private const string PdfExtension = ".pdf";
        private const string DocxExtension = ".docx";
        private const string NotEmbeddableFileNote = "Файл «{0}» не может быть встроен в документ: формат {1} не поддерживается. Сохраните его в формате .docx или .pdf.";
        private const string UnreadableFileNote = "Не удалось встроить содержимое файла «{0}».";
        private const string RunningHeaderSeparator = " / ";
        private const string DefaultLibreOfficePath = @"C:\Program Files\LibreOffice\program\soffice.exe";
        private const float PdfPageMargin = 50f;
        private const ushort RunningHeaderHalfPoints = 18;
        private const string RunningHeaderHexColor = "808080";
        private const uint HeaderFooterDistanceTwips = 500U;
        private const float RunningHeaderFontSize = 9f;
        private const float RunningHeaderOffset = 28f;
        private const float PageNumberFontSize = 9f;
        private const float PageNumberOffset = 22f;
        private static readonly iTextSharp.text.BaseColor RunningHeaderColor = new iTextSharp.text.BaseColor(128, 128, 128);

        private readonly Dictionary<string, List<Attachment>> _attachmentsByContainer = new Dictionary<string, List<Attachment>>();

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
                    var sections = new DocxSectionState(AddPageNumberFooter(mainPart));

                    AppendTitle(body, string.IsNullOrWhiteSpace(documentTitle) ? root.Name : documentTitle);
                    if (root.Subject != null && !string.IsNullOrWhiteSpace(root.Subject.Name))
                    {
                        AppendParagraph(body, root.Subject.Name, isSubtitle: true, justification: JustificationValues.Center);
                    }

                    if (root.Children != null && root.Children.Any())
                    {
                        foreach (var child in SortChildren(root.Children))
                        {
                            AppendConcept(body, mainPart, child, new List<string>(), hiddenTestIds, testQuestionsHeading, sections);
                        }
                    }

                    EnsureUniqueDrawingIds(body);
                    body.AppendChild(BuildSectionProperties(sections.CurrentHeaderPartId, sections.CurrentFooterPartId));
                }

                return ms.ToArray();
            }
        }

        private void AppendConcept(
            Body body,
            MainDocumentPart mainPart,
            Concept node,
            List<string> parentPath,
            ISet<int> hiddenTestIds,
            string testQuestionsHeading,
            DocxSectionState sections)
        {
            if (!HasExportableContent(node, hiddenTestIds))
            {
                return;
            }

            var path = new List<string>(parentPath) { SanitizeForWord(node.Name) };

            if (node.Test != null)
            {
                StartSection(body, mainPart, sections, BuildRunningHeader(path));
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

            var attachments = GetExportableAttachments(node);
            if (attachments.Any())
            {
                StartSection(body, mainPart, sections, BuildRunningHeader(path));
                foreach (var a in attachments)
                {
                    AppendAttachmentContent(body, mainPart, a);
                }
            }

            if (node.Children != null && node.Children.Any())
            {
                foreach (var child in SortChildren(node.Children))
                {
                    AppendConcept(body, mainPart, child, path, hiddenTestIds, testQuestionsHeading, sections);
                }
            }
        }

        private static void StartSection(Body body, MainDocumentPart mainPart, DocxSectionState sections, string headerText)
        {
            body.AppendChild(new Paragraph(new ParagraphProperties(
                BuildSectionProperties(sections.CurrentHeaderPartId, sections.CurrentFooterPartId))));

            sections.CurrentHeaderPartId = AddRunningHeader(mainPart, headerText);
            sections.CurrentFooterPartId = sections.PageNumberFooterPartId;
        }

        private static SectionProperties BuildSectionProperties(string headerPartId, string footerPartId)
        {
            var sectionProperties = new SectionProperties();
            if (!string.IsNullOrEmpty(headerPartId))
            {
                sectionProperties.AppendChild(new HeaderReference { Type = HeaderFooterValues.Default, Id = headerPartId });
            }

            if (!string.IsNullOrEmpty(footerPartId))
            {
                sectionProperties.AppendChild(new FooterReference { Type = HeaderFooterValues.Default, Id = footerPartId });
            }

            sectionProperties.AppendChild(new SectionType { Val = SectionMarkValues.NextPage });
            sectionProperties.AppendChild(new PageSize { Width = PageWidthTwips, Height = PageHeightTwips });
            sectionProperties.AppendChild(new PageMargin
            {
                Top = (int)PageMarginTwips,
                Right = PageMarginTwips,
                Bottom = (int)PageMarginTwips,
                Left = PageMarginTwips,
                Header = HeaderFooterDistanceTwips,
                Footer = HeaderFooterDistanceTwips,
                Gutter = 0U,
            });
            return sectionProperties;
        }

        private static string AddRunningHeader(MainDocumentPart mainPart, string text)
        {
            var headerPart = mainPart.AddNewPart<HeaderPart>();
            headerPart.Header = new Header(new Paragraph(
                new ParagraphProperties(new Justification { Val = JustificationValues.Left }),
                new Run(
                    BuildMutedRunProperties(),
                    new Text(SanitizeForWord(text)) { Space = SpaceProcessingModeValues.Preserve })));
            headerPart.Header.Save();
            return mainPart.GetIdOfPart(headerPart);
        }

        private static string AddPageNumberFooter(MainDocumentPart mainPart)
        {
            var footerPart = mainPart.AddNewPart<FooterPart>();
            footerPart.Footer = new Footer(new Paragraph(
                new ParagraphProperties(new Justification { Val = JustificationValues.Center }),
                new SimpleField(new Run(BuildMutedRunProperties(), new Text("1"))) { Instruction = " PAGE " }));
            footerPart.Footer.Save();
            return mainPart.GetIdOfPart(footerPart);
        }

        private static RunProperties BuildMutedRunProperties()
        {
            var runProperties = BuildRunProperties(bold: false, italic: false, fontHalfPoints: RunningHeaderHalfPoints);
            runProperties.InsertBefore(new Color { Val = RunningHeaderHexColor }, runProperties.GetFirstChild<FontSize>());
            return runProperties;
        }

        private sealed class DocxSectionState
        {
            public DocxSectionState(string pageNumberFooterPartId)
            {
                PageNumberFooterPartId = pageNumberFooterPartId;
            }

            public string PageNumberFooterPartId { get; }

            public string CurrentHeaderPartId { get; set; }

            public string CurrentFooterPartId { get; set; }
        }

        private void AppendAttachmentContent(Body body, MainDocumentPart mainPart, Attachment a)
        {
            var path = _filesManagementService.GetFullPath(a);
            if (string.IsNullOrWhiteSpace(path) || !File.Exists(path))
            {
                return;
            }

            var ext = (Path.GetExtension(path) ?? string.Empty).ToLowerInvariant();

            if (NotEmbeddableDocumentExtensions.Contains(ext))
            {
                AppendParagraph(body, string.Format(NotEmbeddableFileNote, a.Name, ext), italic: true, fontHalfPoints: BodyHalfPoints);
                return;
            }

            var sourceDocx = FindRetainedSourceDocx(path);
            var docxToEmbed = sourceDocx ?? (ext == DocxExtension ? path : null);
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
            var lines = EumkAttachmentTextExtractor.ExtractParagraphLines(path).ToList();
            if (!lines.Any())
            {
                AppendParagraph(body, string.Format(UnreadableFileNote, a.Name), italic: true, fontHalfPoints: BodyHalfPoints);
                return;
            }

            foreach (var line in lines)
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
            var chunks = new List<PdfChunk>();
            var title = string.IsNullOrWhiteSpace(documentTitle) ? root.Name : documentTitle;
            chunks.Add(new PdfChunk(BuildCoverChunkPdf(title, root, baseFont), null));

            if (root.Children != null && root.Children.Any())
            {
                foreach (var child in SortChildren(root.Children))
                {
                    CollectPdfChunks(chunks, child, new List<string>(), hiddenTestIds, testQuestionsHeading, baseFont);
                }
            }

            var merged = MergePdfChunks(chunks, out var pageHeaders);
            return StampPageDecorations(merged, pageHeaders, baseFont);
        }

        private void CollectPdfChunks(
            List<PdfChunk> chunks,
            Concept node,
            List<string> parentPath,
            ISet<int> hiddenTestIds,
            string testQuestionsHeading,
            BaseFont baseFont)
        {
            if (!HasExportableContent(node, hiddenTestIds))
            {
                return;
            }

            var path = new List<string>(parentPath) { SanitizeForWord(node.Name) };
            var header = BuildRunningHeader(path);

            if (node.Test != null)
            {
                chunks.Add(new PdfChunk(BuildTestChunkPdf(node, testQuestionsHeading, baseFont), header));
                return;
            }

            var imagePaths = new List<string>();
            var textOnly = new List<Attachment>();
            var notes = new List<string>();

            void FlushInlineContent()
            {
                if (imagePaths.Any() || textOnly.Any() || notes.Any())
                {
                    chunks.Add(new PdfChunk(BuildContentChunkPdf(imagePaths, textOnly, notes, baseFont), header));
                    imagePaths = new List<string>();
                    textOnly = new List<Attachment>();
                    notes = new List<string>();
                }
            }

            foreach (var a in GetExportableAttachments(node))
            {
                var filePath = _filesManagementService.GetFullPath(a);
                if (string.IsNullOrWhiteSpace(filePath) || !File.Exists(filePath))
                {
                    continue;
                }

                var ext = (Path.GetExtension(filePath) ?? string.Empty).ToLowerInvariant();
                if (ext == PdfExtension)
                {
                    var bytes = SafeReadAllBytes(filePath);
                    if (IsReadablePdf(bytes))
                    {
                        FlushInlineContent();
                        chunks.Add(new PdfChunk(bytes, header));
                    }
                    else
                    {
                        notes.Add(string.Format(UnreadableFileNote, a.Name));
                    }
                }
                else if (ext == DocxExtension)
                {
                    var bytes = ConvertDocxToPdf(filePath, baseFont);
                    if (IsReadablePdf(bytes))
                    {
                        FlushInlineContent();
                        chunks.Add(new PdfChunk(bytes, header));
                    }
                    else
                    {
                        textOnly.Add(a);
                    }
                }
                else if (NotEmbeddableDocumentExtensions.Contains(ext))
                {
                    notes.Add(string.Format(NotEmbeddableFileNote, a.Name, ext));
                }
                else if (IsImageExtension(ext))
                {
                    imagePaths.Add(filePath);
                }
                else
                {
                    textOnly.Add(a);
                }
            }

            FlushInlineContent();

            if (node.Children != null && node.Children.Any())
            {
                foreach (var child in SortChildren(node.Children))
                {
                    CollectPdfChunks(chunks, child, path, hiddenTestIds, testQuestionsHeading, baseFont);
                }
            }
        }

        private static string BuildRunningHeader(IEnumerable<string> path)
        {
            return string.Join(RunningHeaderSeparator, path.Where(p => !string.IsNullOrWhiteSpace(p)));
        }

        private static byte[] ConvertDocxToPdf(string docxPath, BaseFont baseFont)
        {
            if (IsLibreOfficeAvailable())
            {
                string tempDir = null;
                string convertedPath = null;
                try
                {
                    tempDir = Path.Combine(Path.GetTempPath(), "eumk-export-" + Guid.NewGuid().ToString("N"));
                    Directory.CreateDirectory(tempDir);
                    var tempDocx = Path.Combine(tempDir, Guid.NewGuid().ToString("N") + DocxExtension);
                    File.Copy(docxPath, tempDocx);
                    var fileName = new WordToPdfConvertor().Convert(tempDocx);
                    var outputDir = (ConfigurationManager.AppSettings["FileUploadPathTemp"] ?? string.Empty)
                        .Replace("//", "\\")
                        .TrimEnd('/', '\\');
                    convertedPath = Path.Combine(Path.GetFullPath(outputDir), fileName);
                    var bytes = SafeReadAllBytes(convertedPath);
                    if (IsReadablePdf(bytes))
                    {
                        return bytes;
                    }
                }
                catch
                {
                }
                finally
                {
                    TryDeleteFile(convertedPath);
                    TryDeleteDirectory(tempDir);
                }
            }

            try
            {
                return new DocxToPdfRenderer(baseFont).Render(docxPath, PdfPageMargin);
            }
            catch
            {
                return null;
            }
        }

        private static bool IsLibreOfficeAvailable()
        {
            try
            {
                var path = ConfigurationManager.AppSettings["LibreOfficePath"] ?? DefaultLibreOfficePath;
                return File.Exists(path);
            }
            catch
            {
                return false;
            }
        }

        private static void TryDeleteFile(string path)
        {
            try
            {
                if (!string.IsNullOrEmpty(path) && File.Exists(path))
                {
                    File.Delete(path);
                }
            }
            catch
            {
            }
        }

        private static void TryDeleteDirectory(string path)
        {
            try
            {
                if (!string.IsNullOrEmpty(path) && Directory.Exists(path))
                {
                    Directory.Delete(path, true);
                }
            }
            catch
            {
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

        private byte[] BuildContentChunkPdf(
            List<string> imagePaths,
            List<Attachment> textOnly,
            List<string> notes,
            BaseFont baseFont)
        {
            return RenderPdfChunk(doc =>
            {
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

                var fontBody = new Font(baseFont, 11f, Font.NORMAL);
                var fontNote = new Font(baseFont, 11f, Font.ITALIC);
                foreach (var a in textOnly)
                {
                    var lines = GetAttachmentContentLines(a).ToList();
                    if (!lines.Any())
                    {
                        notes.Add(string.Format(UnreadableFileNote, a.Name));
                        continue;
                    }

                    foreach (var line in lines)
                    {
                        doc.Add(new iTextSharp.text.Paragraph(SanitizeForWord(line), fontBody)
                        {
                            Alignment = iTextSharp.text.Element.ALIGN_JUSTIFIED,
                            SpacingAfter = 2f,
                        });
                    }
                }

                foreach (var note in notes)
                {
                    doc.Add(new iTextSharp.text.Paragraph(SanitizeForWord(note), fontNote)
                    {
                        SpacingAfter = 2f,
                    });
                }

                if (!imagePaths.Any() && !textOnly.Any() && !notes.Any())
                {
                    doc.Add(new iTextSharp.text.Chunk(" "));
                }
            });
        }

        private byte[] BuildTestChunkPdf(Concept node, string testQuestionsHeading, BaseFont baseFont)
        {
            return RenderPdfChunk(doc =>
            {
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
                var doc = new PdfDocument(iTextSharp.text.PageSize.A4, PdfPageMargin, PdfPageMargin, PdfPageMargin, PdfPageMargin);
                PdfWriter.GetInstance(doc, ms);
                doc.Open();
                fill(doc);
                doc.Close();
                return ms.ToArray();
            }
        }

        private static byte[] MergePdfChunks(List<PdfChunk> chunks, out List<string> pageHeaders)
        {
            pageHeaders = new List<string>();
            PdfReader.unethicalreading = true;
            using (var ms = new MemoryStream())
            {
                var doc = new PdfDocument();
                using (var copy = new PdfSmartCopy(doc, ms))
                {
                    doc.Open();
                    foreach (var chunk in chunks)
                    {
                        if (chunk?.Bytes == null || chunk.Bytes.Length == 0)
                        {
                            continue;
                        }

                        PdfReader reader = null;
                        try
                        {
                            reader = new PdfReader(chunk.Bytes);
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
                                pageHeaders.Add(chunk.Header);
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

        private static byte[] StampPageDecorations(byte[] pdf, List<string> pageHeaders, BaseFont baseFont)
        {
            if (pdf == null || pdf.Length == 0)
            {
                return pdf;
            }

            PdfReader.unethicalreading = true;
            var reader = new PdfReader(pdf);
            try
            {
                using (var ms = new MemoryStream())
                {
                    using (var stamper = new PdfStamper(reader, ms))
                    {
                        var headerFont = new Font(baseFont, RunningHeaderFontSize, Font.NORMAL, RunningHeaderColor);
                        var footerFont = new Font(baseFont, PageNumberFontSize, Font.NORMAL, RunningHeaderColor);

                        for (var page = 2; page <= reader.NumberOfPages; page++)
                        {
                            var size = reader.GetPageSizeWithRotation(page);
                            var canvas = stamper.GetOverContent(page);
                            var header = page - 1 < pageHeaders.Count ? pageHeaders[page - 1] : null;
                            if (!string.IsNullOrWhiteSpace(header))
                            {
                                var maxWidth = size.Width - 2 * PdfPageMargin;
                                var text = FitToWidth(header, baseFont, RunningHeaderFontSize, maxWidth);
                                ColumnText.ShowTextAligned(canvas, iTextSharp.text.Element.ALIGN_LEFT,
                                    new iTextSharp.text.Phrase(text, headerFont),
                                    size.Left + PdfPageMargin, size.Top - RunningHeaderOffset, 0);
                            }

                            ColumnText.ShowTextAligned(canvas, iTextSharp.text.Element.ALIGN_CENTER,
                                new iTextSharp.text.Phrase(page.ToString(), footerFont),
                                size.Left + size.Width / 2f, size.Bottom + PageNumberOffset, 0);
                        }
                    }

                    return ms.ToArray();
                }
            }
            finally
            {
                reader.Close();
            }
        }

        private static string FitToWidth(string text, BaseFont font, float fontSize, float maxWidth)
        {
            if (font.GetWidthPoint(text, fontSize) <= maxWidth)
            {
                return text;
            }

            const string ellipsis = "...";
            var result = text;
            while (result.Length > 1 && font.GetWidthPoint(ellipsis + result, fontSize) > maxWidth)
            {
                result = result.Substring(1);
            }

            return ellipsis + result.TrimStart();
        }

        private sealed class PdfChunk
        {
            public PdfChunk(byte[] bytes, string header)
            {
                Bytes = bytes;
                Header = header;
            }

            public byte[] Bytes { get; }

            public string Header { get; }
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

        public bool IsDocxExportSupported(Concept root)
        {
            return EnumerateConcepts(root)
                .SelectMany(node => GetExportableAttachments(node))
                .All(a => IsWordCompatibleAttachment(a));
        }

        private bool IsWordCompatibleAttachment(Attachment a)
        {
            var path = _filesManagementService.GetFullPath(a);
            var ext = (Path.GetExtension(path) ?? string.Empty).ToLowerInvariant();
            if (!LayoutSensitiveExtensions.Contains(ext))
            {
                return true;
            }

            return ext == PdfExtension && FindRetainedSourceDocx(path) != null;
        }

        private static IEnumerable<Concept> EnumerateConcepts(Concept node)
        {
            if (node == null)
            {
                yield break;
            }

            yield return node;

            foreach (var child in node.Children ?? Enumerable.Empty<Concept>())
            {
                foreach (var descendant in EnumerateConcepts(child))
                {
                    yield return descendant;
                }
            }
        }

        private bool HasExportableContent(Concept node, ISet<int> hiddenTestIds)
        {
            if (node == null)
            {
                return false;
            }

            if (node.Test != null)
            {
                return hiddenTestIds == null || !hiddenTestIds.Contains(node.Test.Id);
            }

            if (GetExportableAttachments(node).Any())
            {
                return true;
            }

            return node.Children != null && node.Children.Any(child => HasExportableContent(child, hiddenTestIds));
        }

        private List<Attachment> GetExportableAttachments(Concept node)
        {
            if (node == null || node.IsGroup || string.IsNullOrEmpty(node.Container))
            {
                return new List<Attachment>();
            }

            if (!_attachmentsByContainer.TryGetValue(node.Container, out var attachments))
            {
                attachments = (_filesManagementService.GetAttachments(node.Container) ?? new List<Attachment>())
                    .Where(a => IsExportableExtension((Path.GetExtension(a.FileName) ?? string.Empty).ToLowerInvariant()))
                    .ToList();
                _attachmentsByContainer[node.Container] = attachments;
            }

            return attachments;
        }

        private static bool IsExportableExtension(string ext)
        {
            return ext == PdfExtension
                || TextExtensions.Contains(ext)
                || NotEmbeddableDocumentExtensions.Contains(ext)
                || IsImageExtension(ext);
        }

        private static bool IsReadablePdf(byte[] bytes)
        {
            if (bytes == null || bytes.Length == 0)
            {
                return false;
            }

            PdfReader.unethicalreading = true;
            PdfReader reader = null;
            try
            {
                reader = new PdfReader(bytes);
                return reader.NumberOfPages > 0;
            }
            catch
            {
                return false;
            }
            finally
            {
                reader?.Close();
            }
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
