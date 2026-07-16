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
        public static void AppendDocxAsAltChunk(Body targetBody, MainDocumentPart targetMainPart, string sourcePath)
        {
            if (targetBody == null || targetMainPart == null || string.IsNullOrWhiteSpace(sourcePath) || !File.Exists(sourcePath))
            {
                return;
            }

            var altChunkId = "eumkAlt" + Guid.NewGuid().ToString("N");
            var chunkPart = targetMainPart.AddAlternativeFormatImportPart(
                AlternativeFormatImportPartType.WordprocessingML, altChunkId);
            using (var fileStream = File.Open(sourcePath, FileMode.Open, FileAccess.Read))
            {
                chunkPart.FeedData(fileStream);
            }

            targetBody.AppendChild(new AltChunk { Id = altChunkId });
        }

        public static void AppendDocxBodyElements(Body targetBody, MainDocumentPart targetMainPart, string sourcePath)
        {
            if (targetBody == null || targetMainPart == null || string.IsNullOrWhiteSpace(sourcePath) || !File.Exists(sourcePath))
            {
                return;
            }

            using (var src = WordprocessingDocument.Open(sourcePath, false))
            {
                var srcMainPart = src.MainDocumentPart;
                var srcBody = srcMainPart?.Document?.Body;
                if (srcBody == null)
                {
                    return;
                }

                var numIdMap = ImportNumbering(srcMainPart, targetMainPart);

                foreach (var element in srcBody.Elements())
                {
                    if (element is Paragraph || element is Table)
                    {
                        var clone = element.CloneNode(true);
                        ImportImages(clone, srcMainPart, targetMainPart);
                        RemapNumbering(clone, numIdMap);
                        targetBody.AppendChild(clone);
                    }
                }
            }
        }
        private static Dictionary<int, int> ImportNumbering(MainDocumentPart srcMainPart, MainDocumentPart targetMainPart)
        {
            var numIdMap = new Dictionary<int, int>();
            try
            {
                var srcNumPart = srcMainPart.NumberingDefinitionsPart;
                if (srcNumPart?.Numbering == null)
                {
                    return numIdMap;
                }

                var targetNumPart = targetMainPart.NumberingDefinitionsPart;
                if (targetNumPart == null)
                {
                    targetNumPart = targetMainPart.AddNewPart<NumberingDefinitionsPart>();
                    targetNumPart.Numbering = new Numbering();
                }

                var targetNumbering = targetNumPart.Numbering;
                var maxAbstract = targetNumbering.Elements<AbstractNum>()
                    .Select(a => (int)a.AbstractNumberId.Value).DefaultIfEmpty(0).Max();
                var maxNum = targetNumbering.Elements<NumberingInstance>()
                    .Select(n => (int)n.NumberID.Value).DefaultIfEmpty(0).Max();

                var abstractMap = new Dictionary<int, int>();
                foreach (var absNum in srcNumPart.Numbering.Elements<AbstractNum>())
                {
                    var oldAbs = (int)absNum.AbstractNumberId.Value;
                    var newAbs = ++maxAbstract;
                    var cloneAbs = (AbstractNum)absNum.CloneNode(true);
                    cloneAbs.AbstractNumberId = newAbs;

                    var firstNum = targetNumbering.Elements<NumberingInstance>().FirstOrDefault();
                    if (firstNum != null)
                    {
                        targetNumbering.InsertBefore(cloneAbs, firstNum);
                    }
                    else
                    {
                        targetNumbering.AppendChild(cloneAbs);
                    }

                    abstractMap[oldAbs] = newAbs;
                }

                foreach (var numInst in srcNumPart.Numbering.Elements<NumberingInstance>())
                {
                    var oldNum = (int)numInst.NumberID.Value;
                    var newNum = ++maxNum;
                    var cloneNum = (NumberingInstance)numInst.CloneNode(true);
                    cloneNum.NumberID = newNum;

                    var absId = cloneNum.GetFirstChild<AbstractNumId>();
                    if (absId?.Val != null && abstractMap.TryGetValue((int)absId.Val.Value, out var mappedAbs))
                    {
                        absId.Val = mappedAbs;
                    }

                    targetNumbering.AppendChild(cloneNum);
                    numIdMap[oldNum] = newNum;
                }
            }
            catch
            {
            }

            return numIdMap;
        }

        private static void RemapNumbering(OpenXmlElement clone, Dictionary<int, int> numIdMap)
        {
            if (numIdMap.Count == 0)
            {
                return;
            }

            foreach (var numId in clone.Descendants<NumberingId>())
            {
                if (numId.Val != null && numIdMap.TryGetValue((int)numId.Val.Value, out var newId))
                {
                    numId.Val = newId;
                }
            }
        }

        private static void ImportImages(OpenXmlElement clone, MainDocumentPart srcMainPart, MainDocumentPart targetMainPart)
        {
            foreach (var blip in clone.Descendants<DocumentFormat.OpenXml.Drawing.Blip>())
            {
                var embed = blip.Embed?.Value;
                var newId = CopyImagePart(embed, srcMainPart, targetMainPart);
                if (newId != null)
                {
                    blip.Embed = newId;
                }
            }

            foreach (var imageData in clone.Descendants<DocumentFormat.OpenXml.Vml.ImageData>())
            {
                var rid = imageData.RelationshipId?.Value;
                var newId = CopyImagePart(rid, srcMainPart, targetMainPart);
                if (newId != null)
                {
                    imageData.RelationshipId = newId;
                }
            }
        }

        private static string CopyImagePart(string sourceRelationshipId, MainDocumentPart srcMainPart, MainDocumentPart targetMainPart)
        {
            if (string.IsNullOrEmpty(sourceRelationshipId))
            {
                return null;
            }

            try
            {
                if (!(srcMainPart.GetPartById(sourceRelationshipId) is ImagePart srcImagePart))
                {
                    return null;
                }

                var newPart = targetMainPart.AddImagePart(srcImagePart.ContentType);
                using (var stream = srcImagePart.GetStream())
                {
                    newPart.FeedData(stream);
                }

                return targetMainPart.GetIdOfPart(newPart);
            }
            catch
            {
                return null;
            }
        }
    }
}
