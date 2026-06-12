using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;

namespace Application.Core.SLExcel
{
	public class SLExcelWriter
	{
		private static string ColumnLetter(int intCol)
		{
			var intFirstLetter = ((intCol) / 676) + 64;
			var intSecondLetter = ((intCol % 676) / 26) + 64;
			var intThirdLetter = (intCol % 26) + 65;

			var firstLetter = (intFirstLetter > 64)
				? (char)intFirstLetter : ' ';
			var secondLetter = (intSecondLetter > 64)
				? (char)intSecondLetter : ' ';
			var thirdLetter = (char)intThirdLetter;

			return string.Concat(firstLetter, secondLetter,
				thirdLetter).Trim();
		}

		private static void ApplyRowHeight(Row row, UInt32 rowIndex, SLExcelData data)
		{
			if (data.RowHeightsByIndex != null && data.RowHeightsByIndex.TryGetValue(rowIndex, out var rowHeight))
			{
				row.Height = rowHeight;
				row.CustomHeight = true;
				return;
			}

			if (data.DefaultDataRowHeight.HasValue && rowIndex > 2)
			{
				row.Height = data.DefaultDataRowHeight.Value;
				row.CustomHeight = true;
			}
		}

		private Cell CreateTextCell(string header, UInt32 index, string text, uint? styleIndex = null)
		{
			var cell = new Cell
			{
				DataType = CellValues.InlineString,
				CellReference = header + index
			};
			if (styleIndex.HasValue)
			{
				cell.StyleIndex = styleIndex.Value;
			}

			var istring = new InlineString();
			var t = new Text { Text = text ?? string.Empty };
			if (!string.IsNullOrEmpty(text) && text.Contains("\n"))
			{
				t.Space = SpaceProcessingModeValues.Preserve;
			}

			istring.AppendChild(t);

			cell.AppendChild(istring);
			return cell;
		}

		private static Stylesheet CreateBorderedStylesheet()
		{
			var defaultFont = new Font(
				new FontSize { Val = 11 },
				new Color { Theme = 1U },
				new FontName { Val = "Calibri" });
			var boldFont = new Font(
				new FontSize { Val = 11 },
				new Color { Theme = 1U },
				new FontName { Val = "Calibri" },
				new Bold());
			var fonts = new Fonts(defaultFont, boldFont) { Count = 2U };

			var fills = new Fills(
				new Fill(new PatternFill { PatternType = PatternValues.None }),
				new Fill(new PatternFill { PatternType = PatternValues.Gray125 }))
			{
				Count = 2U
			};

			var borderEmpty = new Border(
				new LeftBorder(),
				new RightBorder(),
				new TopBorder(),
				new BottomBorder(),
				new DiagonalBorder());
			var borderThin = new Border(
				new LeftBorder(new Color { Rgb = "FF000000" }) { Style = BorderStyleValues.Thin },
				new RightBorder(new Color { Rgb = "FF000000" }) { Style = BorderStyleValues.Thin },
				new TopBorder(new Color { Rgb = "FF000000" }) { Style = BorderStyleValues.Thin },
				new BottomBorder(new Color { Rgb = "FF000000" }) { Style = BorderStyleValues.Thin },
				new DiagonalBorder());
			var borderTopLeftRight = new Border(
				new LeftBorder(new Color { Rgb = "FF000000" }) { Style = BorderStyleValues.Thin },
				new RightBorder(new Color { Rgb = "FF000000" }) { Style = BorderStyleValues.Thin },
				new TopBorder(new Color { Rgb = "FF000000" }) { Style = BorderStyleValues.Thin },
				new BottomBorder(),
				new DiagonalBorder());
			var borderLeftRightBottom = new Border(
				new LeftBorder(new Color { Rgb = "FF000000" }) { Style = BorderStyleValues.Thin },
				new RightBorder(new Color { Rgb = "FF000000" }) { Style = BorderStyleValues.Thin },
				new TopBorder(),
				new BottomBorder(new Color { Rgb = "FF000000" }) { Style = BorderStyleValues.Thin },
				new DiagonalBorder());
			var borders = new Borders(borderEmpty, borderThin, borderTopLeftRight, borderLeftRightBottom) { Count = 4U };

			var cellStyleFormats = new CellStyleFormats(
				new CellFormat
				{
					NumberFormatId = 0U,
					FontId = 0U,
					FillId = 0U,
					BorderId = 0U
				})
			{
				Count = 1U
			};

			var cellFormats = new CellFormats(
				new CellFormat
				{
					NumberFormatId = 0U,
					FontId = 0U,
					FillId = 0U,
					BorderId = 0U,
					FormatId = 0U,
					ApplyFill = true
				},
				new CellFormat
				{
					NumberFormatId = 0U,
					FontId = 0U,
					FillId = 0U,
					BorderId = 1U,
					FormatId = 0U,
					ApplyBorder = true,
					ApplyAlignment = true,
					Alignment = new Alignment
					{
						WrapText = true,
						Vertical = VerticalAlignmentValues.Top
					}
				},
				new CellFormat
				{
					NumberFormatId = 0U,
					FontId = 1U,
					FillId = 0U,
					BorderId = 1U,
					FormatId = 0U,
					ApplyBorder = true,
					ApplyFont = true,
					ApplyAlignment = true,
					Alignment = new Alignment
					{
						WrapText = true,
						Horizontal = HorizontalAlignmentValues.Center,
						Vertical = VerticalAlignmentValues.Center
					}
				},
				new CellFormat
				{
					NumberFormatId = 0U,
					FontId = 1U,
					FillId = 0U,
					BorderId = 2U,
					FormatId = 0U,
					ApplyBorder = true,
					ApplyFont = true,
					ApplyAlignment = true,
					Alignment = new Alignment
					{
						WrapText = true,
						Horizontal = HorizontalAlignmentValues.Center,
						Vertical = VerticalAlignmentValues.Center
					}
				},
				new CellFormat
				{
					NumberFormatId = 0U,
					FontId = 1U,
					FillId = 0U,
					BorderId = 3U,
					FormatId = 0U,
					ApplyBorder = true,
					ApplyFont = true,
					ApplyAlignment = true,
					Alignment = new Alignment
					{
						WrapText = true,
						Horizontal = HorizontalAlignmentValues.Center,
						Vertical = VerticalAlignmentValues.Center
					}
				},
				new CellFormat
				{
					NumberFormatId = 0U,
					FontId = 0U,
					FillId = 0U,
					BorderId = 0U,
					FormatId = 0U,
					ApplyAlignment = true,
					Alignment = new Alignment
					{
						WrapText = true,
						Vertical = VerticalAlignmentValues.Top
					}
				},
				new CellFormat
				{
					NumberFormatId = 0U,
					FontId = 1U,
					FillId = 0U,
					BorderId = 0U,
					FormatId = 0U,
					ApplyFont = true,
					ApplyAlignment = true,
					Alignment = new Alignment
					{
						WrapText = true,
						Vertical = VerticalAlignmentValues.Top
					}
				})
			{
				Count = 7U
			};

			return new Stylesheet(fonts, fills, borders, cellStyleFormats, cellFormats);
		}

		public byte[] GenerateExcel(SLExcelData data)
		{
			var stream = new MemoryStream();
			var document = SpreadsheetDocument
				.Create(stream, SpreadsheetDocumentType.Workbook);

			var workbookpart = document.AddWorkbookPart();
			workbookpart.Workbook = new Workbook();
			var useBorderStyles = data.ApplyThinBorders || data.ApplyHeaderRowBorderOnly;
			if (useBorderStyles)
			{
				var stylesPart = workbookpart.AddNewPart<WorkbookStylesPart>();
				stylesPart.Stylesheet = CreateBorderedStylesheet();
				stylesPart.Stylesheet.Save();
			}

			var worksheetPart = workbookpart.AddNewPart<WorksheetPart>();
			var sheetData = new SheetData();
			var sheetFormatProperties = new SheetFormatProperties
			{
				DefaultColumnWidth = 9D,
				DefaultRowHeight = 15D
			};
			var worksheet = new Worksheet(sheetFormatProperties, sheetData);
			worksheetPart.Worksheet = worksheet;

			var sheets = document.WorkbookPart.Workbook.
				AppendChild<Sheets>(new Sheets());

			var sheet = new Sheet()
			{
				Id = document.WorkbookPart
					.GetIdOfPart(worksheetPart),
				SheetId = 1,
				Name = data.SheetName ?? "Sheet 1"
			};
			sheets.AppendChild(sheet);

			// Add header
			UInt32 rowIdex = 0;
			var headerStyle = useBorderStyles ? (uint?)2U : null;

			if (data.SparseHeaderRows != null && data.SparseHeaderRows.Count > 0)
			{
				foreach (var sparseRow in data.SparseHeaderRows)
				{
					rowIdex++;
					var row = new Row { RowIndex = rowIdex };
					ApplyRowHeight(row, rowIdex, data);
					foreach (var kv in sparseRow.OrderBy(k => k.Key))
					{
						var cellRef = ColumnLetter(kv.Key) + rowIdex;
						uint? cellHeaderStyle = headerStyle;
						if (useBorderStyles && data.HeaderCellStylesByReference != null
							&& data.HeaderCellStylesByReference.TryGetValue(cellRef, out var styleOverride))
						{
							cellHeaderStyle = styleOverride;
						}

						row.AppendChild(CreateTextCell(
							ColumnLetter(kv.Key),
							rowIdex,
							kv.Value ?? string.Empty,
							cellHeaderStyle));
					}

					sheetData.AppendChild(row);
				}
			}
			else
			{
				rowIdex++;
				var row = new Row { RowIndex = rowIdex };
				ApplyRowHeight(row, rowIdex, data);
				var cellIdex = 0;
				foreach (var header in data.Headers)
				{
					row.AppendChild(CreateTextCell(ColumnLetter(cellIdex++),
						rowIdex, header ?? string.Empty, headerStyle));
				}

				sheetData.AppendChild(row);
			}

			if (data.ColumnConfigurations != null)
			{
				worksheet.InsertAfter((Columns)data.ColumnConfigurations.Clone(), sheetFormatProperties);
			}

			var bodyStyle = data.ApplyThinBorders && !data.ApplyHeaderRowBorderOnly ? (uint?)1U : null;
			var wrapBodyStyle = data.ApplyWrapTextToDataRows ? (uint?)5U : null;
			foreach (var rowData in data.DataRows)
			{
				var cellIdex = 0;
				rowIdex++;
				var row = new Row { RowIndex = rowIdex };
				ApplyRowHeight(row, rowIdex, data);
				sheetData.AppendChild(row);
				foreach (var callData in rowData)
				{
					var cellRef = ColumnLetter(cellIdex) + rowIdex;
					uint? cellBodyStyle = bodyStyle ?? wrapBodyStyle;
					if (data.DataCellStylesByReference != null
						&& data.DataCellStylesByReference.TryGetValue(cellRef, out var styleOverride))
					{
						cellBodyStyle = styleOverride;
					}

					var cell = CreateTextCell(ColumnLetter(cellIdex++),
						rowIdex, callData ?? string.Empty, cellBodyStyle);
					row.AppendChild(cell);
				}
			}

			if (data.HeaderMergeReferences != null && data.HeaderMergeReferences.Count > 0)
			{
				var mergeCells = new MergeCells();
				foreach (var reference in data.HeaderMergeReferences)
				{
					mergeCells.Append(new MergeCell { Reference = reference });
				}

				mergeCells.Count = (UInt32)data.HeaderMergeReferences.Count;
				worksheetPart.Worksheet.InsertAfter(mergeCells, sheetData);
			}

			workbookpart.Workbook.Save();
			document.Close();

			return stream.ToArray();
		}
	}
}