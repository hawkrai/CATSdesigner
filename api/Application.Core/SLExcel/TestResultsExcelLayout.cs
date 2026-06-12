using System.Collections.Generic;
using DocumentFormat.OpenXml.Spreadsheet;

namespace Application.Core.SLExcel
{
	public static class TestResultsExcelLayout
	{
		private const double StudentWidth = 40D;
		private const double StartDateTimeWidth = 14D;
		private const double EndDateTimeWidth = 16D;
		private const double MarkWidth = 9D;
		private const double AverageWidth = 11D;
		private const double HeaderRow1Height = 56D;
		private const double HeaderRow2Height = 40D;
		private const double DataRowHeight = 28.5D;

		public static void Apply(SLExcelData data, int testCount)
		{
			data.ColumnConfigurations = BuildColumnWidths(testCount);
			data.RowHeightsByIndex = new Dictionary<uint, double>
			{
				{ 1U, HeaderRow1Height },
				{ 2U, HeaderRow2Height },
			};
			data.DefaultDataRowHeight = DataRowHeight;
		}

		private static Columns BuildColumnWidths(int testCount)
		{
			var columns = new Columns();
			columns.Append(new Column
			{
				Min = 1U,
				Max = 1U,
				Width = StudentWidth,
				CustomWidth = true
			});

			for (var i = 0; i < testCount; i++)
			{
				var startCol = (uint)(2 + (3 * i));
				var endCol = (uint)(3 + (3 * i));
				var markCol = (uint)(4 + (3 * i));

				columns.Append(new Column
				{
					Min = startCol,
					Max = startCol,
					Width = StartDateTimeWidth,
					CustomWidth = true
				});
				columns.Append(new Column
				{
					Min = endCol,
					Max = endCol,
					Width = EndDateTimeWidth,
					CustomWidth = true
				});
				columns.Append(new Column
				{
					Min = markCol,
					Max = markCol,
					Width = MarkWidth,
					CustomWidth = true
				});
			}

			var averageCol = (uint)(2 + (3 * testCount));
			columns.Append(new Column
			{
				Min = averageCol,
				Max = averageCol,
				Width = AverageWidth,
				CustomWidth = true
			});

			return columns;
		}
	}
}
