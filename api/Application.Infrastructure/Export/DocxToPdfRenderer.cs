using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using iTextSharp.text;
using iTextSharp.text.pdf;
using A = DocumentFormat.OpenXml.Drawing;
using DW = DocumentFormat.OpenXml.Drawing.Wordprocessing;
using Font = iTextSharp.text.Font;
using PdfDocument = iTextSharp.text.Document;
using PdfParagraph = iTextSharp.text.Paragraph;
using WordParagraph = DocumentFormat.OpenXml.Wordprocessing.Paragraph;
using WordTable = DocumentFormat.OpenXml.Wordprocessing.Table;
using WordRun = DocumentFormat.OpenXml.Wordprocessing.Run;
using WordText = DocumentFormat.OpenXml.Wordprocessing.Text;
using WordBreak = DocumentFormat.OpenXml.Wordprocessing.Break;

namespace Application.Infrastructure.Export
{
    public sealed class DocxToPdfRenderer
    {
        private const float DefaultFontSize = 11f;
        private const float EmuPerPoint = 12700f;
        private const float ListIndentPoints = 18f;
        private const float TwipsPerPoint = 20f;
        private const string Bullet = "•";

        private static readonly Dictionary<int, float> HeadingSizes = new Dictionary<int, float>
        {
            { 1, 18f }, { 2, 16f }, { 3, 14f }, { 4, 13f }, { 5, 12f }, { 6, 12f }
        };

        private readonly BaseFont _baseFont;
        private readonly Dictionary<string, int> _listCounters = new Dictionary<string, int>();
        private MainDocumentPart _mainPart;
        private float _contentWidth;
        private float _contentHeight;

        public DocxToPdfRenderer(BaseFont baseFont)
        {
            _baseFont = baseFont;
        }

        public byte[] Render(string docxPath, float margin)
        {
            using (var source = WordprocessingDocument.Open(docxPath, false))
            using (var ms = new MemoryStream())
            {
                _mainPart = source.MainDocumentPart;
                _listCounters.Clear();

                var doc = new PdfDocument(iTextSharp.text.PageSize.A4, margin, margin, margin, margin);
                var writer = PdfWriter.GetInstance(doc, ms);
                writer.CloseStream = false;
                doc.Open();
                _contentWidth = doc.PageSize.Width - doc.LeftMargin - doc.RightMargin;
                _contentHeight = doc.PageSize.Height - doc.TopMargin - doc.BottomMargin;

                var body = _mainPart?.Document?.Body;
                var hasContent = false;
                if (body != null)
                {
                    foreach (var element in RenderBlocks(body.ChildElements, doc, _contentWidth))
                    {
                        if (element is PageBreakElement)
                        {
                            doc.NewPage();
                            continue;
                        }

                        doc.Add(element);
                        hasContent = true;
                    }
                }

                if (!hasContent)
                {
                    doc.Add(new Chunk(" "));
                }

                doc.Close();
                return ms.ToArray();
            }
        }

        private IEnumerable<IElement> RenderBlocks(IEnumerable<OpenXmlElement> elements, PdfDocument doc, float availableWidth)
        {
            foreach (var element in elements)
            {
                if (element is WordParagraph paragraph)
                {
                    foreach (var rendered in RenderParagraph(paragraph, doc, availableWidth))
                    {
                        yield return rendered;
                    }
                }
                else if (element is WordTable table)
                {
                    var rendered = RenderTable(table, doc, availableWidth);
                    if (rendered != null)
                    {
                        yield return rendered;
                    }
                }
                else if (element is SdtBlock sdtBlock)
                {
                    var content = sdtBlock.GetFirstChild<SdtContentBlock>();
                    if (content != null)
                    {
                        foreach (var rendered in RenderBlocks(content.ChildElements, doc, availableWidth))
                        {
                            yield return rendered;
                        }
                    }
                }
            }
        }

        private IEnumerable<IElement> RenderParagraph(WordParagraph paragraph, PdfDocument doc, float availableWidth)
        {
            var properties = paragraph.ParagraphProperties;
            var headingLevel = GetHeadingLevel(properties);
            var baseSize = headingLevel > 0 ? HeadingSizes[Math.Min(headingLevel, 6)] : DefaultFontSize;

            var pdfParagraph = CreatePdfParagraph(properties, baseSize, headingLevel > 0);
            var listPrefix = GetListPrefix(properties);
            if (listPrefix != null)
            {
                pdfParagraph.Add(new Chunk(listPrefix + " ", new Font(_baseFont, baseSize)));
            }

            var hasText = false;
            foreach (var run in paragraph.Descendants<WordRun>())
            {
                if (run.Ancestors<WordParagraph>().FirstOrDefault() != paragraph)
                {
                    continue;
                }

                var font = CreateRunFont(run.RunProperties, baseSize, headingLevel > 0);
                foreach (var child in run.ChildElements)
                {
                    switch (child)
                    {
                        case WordText text:
                            if (!string.IsNullOrEmpty(text.Text))
                            {
                                pdfParagraph.Add(new Chunk(text.Text, font));
                                hasText = true;
                            }
                            break;
                        case TabChar _:
                            pdfParagraph.Add(new Chunk("    ", font));
                            break;
                        case WordBreak wordBreak:
                            if (wordBreak.Type != null && wordBreak.Type.Value == BreakValues.Page)
                            {
                                if (hasText || pdfParagraph.Count > 0)
                                {
                                    yield return pdfParagraph;
                                    pdfParagraph = CreatePdfParagraph(properties, baseSize, headingLevel > 0);
                                    hasText = false;
                                }

                                yield return new PageBreakElement(doc);
                            }
                            else
                            {
                                pdfParagraph.Add(Chunk.NEWLINE);
                            }
                            break;
                        case Drawing drawing:
                            var image = CreateImage(drawing, availableWidth);
                            if (image != null)
                            {
                                if (hasText || pdfParagraph.Count > 0)
                                {
                                    yield return pdfParagraph;
                                    pdfParagraph = CreatePdfParagraph(properties, baseSize, headingLevel > 0);
                                    hasText = false;
                                }

                                yield return image;
                            }
                            break;
                    }
                }
            }

            if (pdfParagraph.Count == 0)
            {
                pdfParagraph.Add(new Chunk(" ", new Font(_baseFont, baseSize)));
            }

            yield return pdfParagraph;
        }

        private PdfParagraph CreatePdfParagraph(ParagraphProperties properties, float baseSize, bool isHeading)
        {
            var pdfParagraph = new PdfParagraph
            {
                Leading = baseSize * 1.25f,
                SpacingAfter = isHeading ? 6f : 4f,
                SpacingBefore = isHeading ? 10f : 0f,
                Alignment = GetAlignment(properties?.Justification),
            };

            var indentation = properties?.Indentation;
            if (indentation != null)
            {
                pdfParagraph.IndentationLeft = TwipsToPoints(indentation.Left?.Value ?? indentation.Start?.Value);
                pdfParagraph.IndentationRight = TwipsToPoints(indentation.Right?.Value ?? indentation.End?.Value);
                pdfParagraph.FirstLineIndent = TwipsToPoints(indentation.FirstLine?.Value) - TwipsToPoints(indentation.Hanging?.Value);
            }

            var numbering = GetEffectiveNumbering(properties);
            var level = numbering?.NumberingId != null
                ? numbering.NumberingLevelReference?.Val?.Value ?? 0
                : -1;
            if (level >= 0 && pdfParagraph.IndentationLeft <= 0)
            {
                pdfParagraph.IndentationLeft = ListIndentPoints * (level + 1);
            }

            return pdfParagraph;
        }

        private Font CreateRunFont(RunProperties properties, float baseSize, bool isHeading)
        {
            var style = isHeading ? Font.BOLD : Font.NORMAL;
            var size = baseSize;
            BaseColor color = null;

            if (properties != null)
            {
                if (IsOn(properties.Bold))
                {
                    style |= Font.BOLD;
                }

                if (IsOn(properties.Italic))
                {
                    style |= Font.ITALIC;
                }

                if (properties.Underline?.Val != null && properties.Underline.Val.Value != UnderlineValues.None)
                {
                    style |= Font.UNDERLINE;
                }

                if (IsOn(properties.Strike))
                {
                    style |= Font.STRIKETHRU;
                }

                if (float.TryParse(properties.FontSize?.Val?.Value, out var halfPoints) && halfPoints > 0)
                {
                    size = halfPoints / 2f;
                }

                var hex = properties.Color?.Val?.Value;
                if (!string.IsNullOrEmpty(hex) && hex.Length == 6 && !string.Equals(hex, "auto", StringComparison.OrdinalIgnoreCase))
                {
                    try
                    {
                        color = new BaseColor(Convert.ToInt32(hex.Substring(0, 2), 16),
                            Convert.ToInt32(hex.Substring(2, 2), 16),
                            Convert.ToInt32(hex.Substring(4, 2), 16));
                    }
                    catch
                    {
                        color = null;
                    }
                }
            }

            return color != null ? new Font(_baseFont, size, style, color) : new Font(_baseFont, size, style);
        }

        private PdfPTable RenderTable(WordTable table, PdfDocument doc, float availableWidth)
        {
            var rows = table.Elements<TableRow>().ToList();
            if (!rows.Any())
            {
                return null;
            }

            var columns = rows.Max(row => row.Elements<TableCell>().Sum(cell => GetGridSpan(cell)));
            if (columns <= 0)
            {
                return null;
            }

            var pdfTable = new PdfPTable(columns)
            {
                WidthPercentage = 100,
                SpacingBefore = 4f,
                SpacingAfter = 6f,
                SplitLate = false,
            };

            var gridWidths = table.GetFirstChild<TableGrid>()?
                .Elements<GridColumn>()
                .Select(col => float.TryParse(col.Width?.Value, out var w) ? w : 0f)
                .ToArray();
            if (gridWidths != null && gridWidths.Length == columns && gridWidths.All(w => w > 0))
            {
                pdfTable.SetWidths(gridWidths);
            }

            var cellWidth = availableWidth / columns;
            foreach (var row in rows)
            {
                var filled = 0;
                foreach (var cell in row.Elements<TableCell>())
                {
                    var span = GetGridSpan(cell);
                    var pdfCell = new PdfPCell
                    {
                        Colspan = span,
                        Padding = 4f,
                        BorderWidth = 0.5f,
                    };

                    var isContinuedMerge = cell.TableCellProperties?.VerticalMerge != null
                        && (cell.TableCellProperties.VerticalMerge.Val == null
                            || cell.TableCellProperties.VerticalMerge.Val.Value == MergedCellValues.Continue);
                    if (!isContinuedMerge)
                    {
                        foreach (var element in RenderBlocks(cell.ChildElements, doc, cellWidth * span - 8f))
                        {
                            if (!(element is PageBreakElement))
                            {
                                pdfCell.AddElement(element);
                            }
                        }
                    }

                    pdfTable.AddCell(pdfCell);
                    filled += span;
                }

                for (; filled < columns; filled++)
                {
                    pdfTable.AddCell(new PdfPCell { BorderWidth = 0.5f });
                }
            }

            return pdfTable;
        }

        private Image CreateImage(Drawing drawing, float availableWidth)
        {
            try
            {
                var blip = drawing.Descendants<A.Blip>().FirstOrDefault();
                var relationshipId = blip?.Embed?.Value;
                if (string.IsNullOrEmpty(relationshipId) || _mainPart == null)
                {
                    return null;
                }

                if (!(_mainPart.GetPartById(relationshipId) is ImagePart imagePart))
                {
                    return null;
                }

                byte[] bytes;
                using (var stream = imagePart.GetStream())
                using (var ms = new MemoryStream())
                {
                    stream.CopyTo(ms);
                    bytes = ms.ToArray();
                }

                var image = Image.GetInstance(bytes);
                var extent = drawing.Descendants<DW.Extent>().FirstOrDefault();
                if (extent?.Cx != null && extent.Cy != null && extent.Cx.Value > 0 && extent.Cy.Value > 0)
                {
                    image.ScaleAbsolute(extent.Cx.Value / EmuPerPoint, extent.Cy.Value / EmuPerPoint);
                }

                var maxWidth = Math.Max(10f, availableWidth);
                var maxHeight = Math.Max(10f, _contentHeight - 20f);
                if (image.ScaledWidth > maxWidth || image.ScaledHeight > maxHeight)
                {
                    image.ScaleToFit(maxWidth, maxHeight);
                }

                image.Alignment = Image.ALIGN_CENTER;
                image.SpacingAfter = 4f;
                return image;
            }
            catch
            {
                return null;
            }
        }

        private NumberingProperties GetEffectiveNumbering(ParagraphProperties properties)
        {
            var own = properties?.NumberingProperties;
            if (own?.NumberingId != null)
            {
                return own;
            }

            var styleId = properties?.ParagraphStyleId?.Val?.Value;
            if (string.IsNullOrEmpty(styleId))
            {
                return own;
            }

            var style = _mainPart?.StyleDefinitionsPart?.Styles?.Elements<Style>()
                .FirstOrDefault(s => s.StyleId?.Value == styleId);
            return style?.StyleParagraphProperties?.NumberingProperties ?? own;
        }

        private string GetListPrefix(ParagraphProperties properties)
        {
            var numbering = GetEffectiveNumbering(properties);
            var numId = numbering?.NumberingId?.Val?.Value;
            if (numId == null || numId.Value == 0)
            {
                return null;
            }

            var level = numbering.NumberingLevelReference?.Val?.Value ?? 0;
            var format = GetNumberFormat(numId.Value, level);
            if (format == null || format == NumberFormatValues.Bullet)
            {
                return Bullet;
            }

            var key = numId.Value + ":" + level;
            _listCounters.TryGetValue(key, out var counter);
            counter++;
            _listCounters[key] = counter;

            foreach (var deeperKey in _listCounters.Keys.Where(k => k.StartsWith(numId.Value + ":")
                && int.TryParse(k.Substring(k.IndexOf(':') + 1), out var l) && l > level).ToList())
            {
                _listCounters.Remove(deeperKey);
            }

            return format == NumberFormatValues.LowerLetter ? ((char)('a' + (counter - 1) % 26)) + ")"
                : format == NumberFormatValues.UpperLetter ? ((char)('A' + (counter - 1) % 26)) + ")"
                : format == NumberFormatValues.RussianLower ? ((char)('а' + (counter - 1) % 32)) + ")"
                : counter + ".";
        }

        private NumberFormatValues? GetNumberFormat(int numId, int level)
        {
            try
            {
                var numbering = _mainPart?.NumberingDefinitionsPart?.Numbering;
                var instance = numbering?.Elements<NumberingInstance>()
                    .FirstOrDefault(n => n.NumberID?.Value == numId);
                var abstractId = instance?.AbstractNumId?.Val?.Value;
                var abstractNum = numbering?.Elements<AbstractNum>()
                    .FirstOrDefault(a => a.AbstractNumberId?.Value == abstractId);
                var levelDefinition = abstractNum?.Elements<Level>()
                    .FirstOrDefault(l => l.LevelIndex?.Value == level);
                return levelDefinition?.NumberingFormat?.Val?.Value;
            }
            catch
            {
                return null;
            }
        }

        private int GetHeadingLevel(ParagraphProperties properties)
        {
            var styleId = properties?.ParagraphStyleId?.Val?.Value;
            if (!string.IsNullOrEmpty(styleId))
            {
                var style = _mainPart?.StyleDefinitionsPart?.Styles?.Elements<Style>()
                    .FirstOrDefault(s => s.StyleId?.Value == styleId);
                var outline = style?.StyleParagraphProperties?.OutlineLevel?.Val?.Value;
                if (outline.HasValue && outline.Value < 9)
                {
                    return outline.Value + 1;
                }

                var name = (style?.StyleName?.Val?.Value ?? styleId).Replace(" ", string.Empty).ToLowerInvariant();
                foreach (var prefix in new[] { "heading", "заголовок" })
                {
                    if (name.StartsWith(prefix) && int.TryParse(name.Substring(prefix.Length), out var level) && level > 0)
                    {
                        return level;
                    }
                }

                if (name == "title")
                {
                    return 1;
                }
            }

            var paragraphOutline = properties?.OutlineLevel?.Val?.Value;
            return paragraphOutline.HasValue && paragraphOutline.Value < 9 ? paragraphOutline.Value + 1 : 0;
        }

        private static int GetAlignment(Justification justification)
        {
            if (justification?.Val == null)
            {
                return Element.ALIGN_LEFT;
            }

            var value = justification.Val.Value;
            if (value == JustificationValues.Center)
            {
                return Element.ALIGN_CENTER;
            }

            if (value == JustificationValues.Right || value == JustificationValues.End)
            {
                return Element.ALIGN_RIGHT;
            }

            if (value == JustificationValues.Both || value == JustificationValues.Distribute)
            {
                return Element.ALIGN_JUSTIFIED;
            }

            return Element.ALIGN_LEFT;
        }

        private static int GetGridSpan(TableCell cell)
        {
            var span = cell.TableCellProperties?.GridSpan?.Val?.Value ?? 1;
            return Math.Max(1, span);
        }

        private static bool IsOn(OnOffType value)
        {
            return value != null && (value.Val == null || value.Val.Value);
        }

        private static float TwipsToPoints(string twips)
        {
            return float.TryParse(twips, out var value) ? value / TwipsPerPoint : 0f;
        }

        private sealed class PageBreakElement : IElement
        {
            public PageBreakElement(PdfDocument doc)
            {
            }

            public bool Process(IElementListener listener)
            {
                return false;
            }

            public int Type => Element.CHUNK;

            public bool IsContent() => false;

            public bool IsNestable() => false;

            public IList<Chunk> Chunks => new List<Chunk>();

            public override string ToString() => string.Empty;
        }
    }
}
