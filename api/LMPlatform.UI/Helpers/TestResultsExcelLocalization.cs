using System;
using System.Collections.Generic;

namespace LMPlatform.UI.Helpers
{
    internal static class TestResultsExcelLocalization
    {
        private static readonly Dictionary<string, Dictionary<string, string>> Labels =
            new Dictionary<string, Dictionary<string, string>>(StringComparer.OrdinalIgnoreCase)
            {
                ["ru"] = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
                {
                    ["Student"] = "Студент",
                    ["AverageTests"] = "Средняя оценка\nза тесты",
                    ["StartDateTime"] = "Дата и время\nначала теста",
                    ["EndDateTime"] = "Дата и время\nокончания теста",
                    ["Mark"] = "Оценка",
                    ["AverageRow"] = "Средняя оценка (процент)\nза тест",
                    ["NoData"] = "Нет данных для выбранных фильтров",
                    ["TestFallback"] = "Тест",
                },
                ["en"] = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
                {
                    ["Student"] = "Student",
                    ["AverageTests"] = "Average score\nfor tests",
                    ["StartDateTime"] = "Test start\ndate and time",
                    ["EndDateTime"] = "Test end\ndate and time",
                    ["Mark"] = "Score",
                    ["AverageRow"] = "Average score (percent)\nper test",
                    ["NoData"] = "No data for selected filters",
                    ["TestFallback"] = "Test",
                },
            };

        public static string Get(string key, string lang)
        {
            var normalizedLang = NormalizeLang(lang);
            if (Labels.TryGetValue(normalizedLang, out var langLabels)
                && langLabels.TryGetValue(key, out var value))
            {
                return value;
            }

            return Labels["ru"][key];
        }

        public static string NormalizeLang(string lang)
        {
            if (string.IsNullOrWhiteSpace(lang))
            {
                return "ru";
            }

            return lang.StartsWith("en", StringComparison.OrdinalIgnoreCase) ? "en" : "ru";
        }
    }
}
