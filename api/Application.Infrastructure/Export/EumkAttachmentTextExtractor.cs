using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using iTextSharp.text.pdf;

namespace Application.Infrastructure.Export
{
    internal static class EumkAttachmentTextExtractor
    {
        private const int MaxCharsPerFile = 120_000;

        public static IEnumerable<string> ExtractParagraphLines(string fullPath)
        {
            if (string.IsNullOrWhiteSpace(fullPath) || !File.Exists(fullPath))
            {
                yield break;
            }

            var ext = System.IO.Path.GetExtension(fullPath) ?? string.Empty;
            IEnumerable<string> raw = null;
            var readFailed = false;
            try
            {
                if (ext.Equals(".docx", StringComparison.OrdinalIgnoreCase))
                {
                    raw = ExtractFromDocx(fullPath);
                }
                else if (ext.Equals(".pdf", StringComparison.OrdinalIgnoreCase))
                {
                    raw = ExtractFromPdf(fullPath);
                }
                else if (ext.Equals(".txt", StringComparison.OrdinalIgnoreCase)
                         || ext.Equals(".csv", StringComparison.OrdinalIgnoreCase)
                         || ext.Equals(".md", StringComparison.OrdinalIgnoreCase))
                {
                    raw = SplitLines(File.ReadAllText(fullPath, Encoding.UTF8));
                }
                else if (ext.Equals(".htm", StringComparison.OrdinalIgnoreCase)
                         || ext.Equals(".html", StringComparison.OrdinalIgnoreCase))
                {
                    raw = SplitLines(StripHtml(File.ReadAllText(fullPath, Encoding.UTF8)));
                }
                else
                {
                    yield break;
                }
            }
            catch
            {
                readFailed = true;
            }

            if (readFailed)
            {
                yield return "(не удалось прочитать содержимое файла)";
                yield break;
            }

            var total = 0;
            foreach (var line in raw)
            {
                var t = line?.Trim() ?? string.Empty;
                if (t.Length == 0)
                {
                    continue;
                }

                if (total + t.Length > MaxCharsPerFile)
                {
                    yield return "… (текст обрезан по лимиту объёма)";
                    yield break;
                }

                total += t.Length;
                yield return t;
            }
        }

        private static IEnumerable<string> ExtractFromDocx(string path)
        {
            using (var doc = WordprocessingDocument.Open(path, false))
            {
                var body = doc.MainDocumentPart?.Document?.Body;
                if (body == null)
                {
                    yield break;
                }

                foreach (var p in body.Descendants<Paragraph>())
                {
                    var texts = p.Descendants<Text>().Select(t => t.Text);
                    var line = string.Concat(texts);
                    if (!string.IsNullOrWhiteSpace(line))
                    {
                        yield return line.Trim();
                    }
                }
            }
        }

        private static IEnumerable<string> ExtractFromPdf(string path)
        {
            using (var reader = new PdfReader(path))
            {
                for (var i = 1; i <= reader.NumberOfPages; i++)
                {
                    var strategy = new iTextSharp.text.pdf.parser.LocationTextExtractionStrategy();
                    var pageText = iTextSharp.text.pdf.parser.PdfTextExtractor.GetTextFromPage(reader, i, strategy);
                    foreach (var line in SplitLines(pageText))
                    {
                        if (!string.IsNullOrWhiteSpace(line))
                        {
                            yield return line.Trim();
                        }
                    }
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

        private static string StripHtml(string html)
        {
            if (string.IsNullOrEmpty(html))
            {
                return string.Empty;
            }

            var noScript = Regex.Replace(html, "<script[^>]*>.*?</script>", " ", RegexOptions.IgnoreCase | RegexOptions.Singleline);
            var noStyle = Regex.Replace(noScript, "<style[^>]*>.*?</style>", " ", RegexOptions.IgnoreCase | RegexOptions.Singleline);
            var noTags = Regex.Replace(noStyle, "<[^>]+>", " ");
            return Regex.Replace(noTags, "\\s+", " ").Trim();
        }
        public static void AppendDocxBodyElements(Body targetBody, string sourcePath)
        {
            if (targetBody == null || string.IsNullOrWhiteSpace(sourcePath) || !File.Exists(sourcePath))
            {
                return;
            }

            using (var src = WordprocessingDocument.Open(sourcePath, false))
            {
                var srcBody = src.MainDocumentPart?.Document?.Body;
                if (srcBody == null)
                {
                    return;
                }

                foreach (var element in srcBody.Elements())
                {
                    if (element is Paragraph p)
                    {
                        targetBody.AppendChild((Paragraph)p.CloneNode(true));
                    }
                    else if (element is Table t)
                    {
                        targetBody.AppendChild((Table)t.CloneNode(true));
                    }
                }
            }
        }
    }
}
