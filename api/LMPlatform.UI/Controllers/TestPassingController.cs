using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Dynamic;
using System.Linq;
using System.Net;
using System.Text;
using System.Web.Mvc;
using Application.Core;
using Application.Core.Constants;
using Application.Core.Helpers;
using Application.Core.SLExcel;
using Application.Core.UI.Controllers;
using Application.Infrastructure.ConceptManagement;
using Application.Infrastructure.FilesManagement;
using Application.Infrastructure.GroupManagement;
using Application.Infrastructure.KnowledgeTestsManagement;
using Application.Infrastructure.SubjectManagement;
using Application.Infrastructure.TestQuestionPassingManagement;
using Application.Infrastructure.UserManagement;
using Bootstrap;
using LMPlatform.Models;
using LMPlatform.Models.AdaptivityLearning;
using LMPlatform.Models.KnowledgeTesting;
using LMPlatform.UI.Attributes;
using LMPlatform.UI.Helpers;
using LMPlatform.UI.ViewModels.KnowledgeTestingViewModels;
using Nest;
using Newtonsoft.Json;
using WebMatrix.WebData;
using static System.Net.Mime.MediaTypeNames;

namespace LMPlatform.UI.Controllers
{
    [JwtAuth]
    public class TestPassingController : BasicController
    {
        private readonly LazyDependency<IFilesManagementService> filesManagementService = new LazyDependency<IFilesManagementService>();
        public IFilesManagementService FilesManagementService => filesManagementService.Value;


        [JwtAuth]
        [HttpGet]
        public ActionResult StudentsTesting(int subjectId)
        {
            var subject = this.SubjectsManagementService.GetSubject(subjectId);
            var available =
                this.TestPassingService.CheckForSubjectAvailableForStudent(UserContext.CurrentUserId, subjectId);
            if (available) return JsonResponse(subject);
            this.ViewBag.Message = "Данный предмет не доступен для студента";
            return StatusCode(HttpStatusCode.BadRequest);
        }

        [HttpGet]
        public JsonResult GetTestDescription(int testId, string deviceId = null)
        {
            var test = this.TestsManagementService.GetTest(testId);
            var description = new
            {
                test.Title,
                test.Description,
                OngoingTestId = 0
            };

            int idUser = UserContext.CurrentUserId;
            var _context = new UsersManagementService();
            var user = _context.GetUserById(idUser);

            if (UserContext.Role == Constants.Roles.Student && user.OngoingTest != null)
            {
                var shouldBlock = true;
                if (!string.IsNullOrEmpty(deviceId) &&
                    !string.IsNullOrEmpty(user.OngoingTestDeviceId) &&
                    string.Equals(user.OngoingTestDeviceId, deviceId, StringComparison.Ordinal))
                {
                    shouldBlock = false;
                }

                if (shouldBlock)
                {
                    var ongoingTest = TestsManagementService.GetTest(user.OngoingTest.Value);

                    description = new
                    {
                        Title = $"{ongoingTest.Title}",
                        Description = "text.test.already.launched",
                        OngoingTestId = user.OngoingTest.Value
                    };
                }
            }

            return JsonResponse(description) as JsonResult;
        }

        [JwtAuth]
        [HttpGet]
        public JsonResult GetAvailableTests(int subjectId)
        {
            var availableTests = this.TestPassingService
                .GetAvailableTestsForStudent(UserContext.CurrentUserId, subjectId)
                .Select(test => new
                {
                    test.Id,
                    test.Title,
                    test.Description,
                    test.ForSelfStudy,
                    test.ForNN
                });

            return JsonResponse(availableTests) as JsonResult;
        }

        [HttpGet]
        public JsonResult GetAvailableTestsForMobile(int subjectId, int userId)
        {
            var availableTests = this.TestPassingService.GetAvailableTestsForUserMobile(userId, subjectId)
                .Select(test => new
                {
                    test.Id,
                    test.Title,
                    test.Description,
                    test.ForSelfStudy
                });

            return JsonResponse(availableTests) as JsonResult;
        }

        [HttpGet]
        public JsonResult GetNextQuestionJson(int testId, int questionNumber, int userId,
            bool excludeCorrectnessIndicator)
        {
            var result = this.TestPassingService.GetNextQuestion(testId, userId, questionNumber);
            Question question = null;
            if (result.Question == null)
                return JsonResponse(new
                {
                    Question = question,
                    result.Number,
                    result.Seconds,
                    result.SetTimeForAllTest,
                    result.ForSelfStudy,
                    IncompleteQuestionsNumbers = result.QuestionsStatuses
                        .Where(qs => qs.Value == PassedQuestionResult.NotPassed).Select(qs => qs.Key)
                }) as JsonResult;

            if (excludeCorrectnessIndicator)
            {
                if (result.Question.QuestionType == QuestionType.TextAnswer)
                {
                    result.Question.Answers = result.Question.Answers.Take(1).ToList();
                }

                result.Question.Answers.ForEach(a => a.СorrectnessIndicator = default);
            }
            question = result.Question.Clone() as Question;

            return JsonResponse(new
            {
                Question = question,
                result.Number,
                result.Seconds,
                result.SetTimeForAllTest,
                result.ForSelfStudy,
                IncompleteQuestionsNumbers = result.QuestionsStatuses
                    .Where(qs => qs.Value == PassedQuestionResult.NotPassed).Select(qs => qs.Key)
            }) as JsonResult;
        }

        [HttpGet]
        public ActionResult GetNextQuestion(int testId, int questionNumber)
        {
            try
            {
                if (questionNumber == 1 && this.TestsManagementService.GetTest(testId, true).Questions.Count == 0)
                {
                    this.ViewBag.Message = "Тест не содержит ни одного вопроса";
                    return StatusCode(HttpStatusCode.BadRequest);
                }

                var nextQuestion =
                    this.TestPassingService.GetNextQuestion(testId, UserContext.CurrentUserId, questionNumber);

                if (nextQuestion.Question != null)
                {
                    return JsonResponse(nextQuestion);
                }

                return GetCloseTestResult(testId, nextQuestion.Mark, nextQuestion.Percent, GetAnswersAsBinary);

            }
            catch (Exception ex)
            {
                return StatusCode(HttpStatusCode.InternalServerError);
            }
        }

        [JwtAuth]
        [HttpGet]
        public JsonResult CloseTestAndGetResult(int testId)
        {
            (int mark, int percent) = this.TestPassingService.SimpleTestCloseById(testId, UserContext.CurrentUserId);
            var closeTestRes = GetCloseTestResult(testId, mark, percent, GetAnswersAsUserAnswer, true);

            int idUser = UserContext.CurrentUserId;
            var _context = new UsersManagementService();
            var user = _context.GetUserById(idUser);
            user.OngoingTest = null;
            user.OngoingTestDeviceId = null;
            _context.UpdateUser(user);
            return JsonResponse(closeTestRes) as JsonResult;
        }

        [JwtAuth]
        [HttpGet]
        public JsonResult GetStudentResults(int subjectId)
        {
            var results = this.TestPassingService
                .GetStidentResults(subjectId, UserContext.CurrentUserId)
                .GroupBy(g => g.TestName)
                .Select(group =>
                {
                    var lastResult = group.Last();
                    var test = this.TestsManagementService.GetTest(lastResult.TestId);

                    return new
                    {
                        Id = lastResult.TestId,
                        Title = group.Key,
                        Points = lastResult.Points,
                        Percent = lastResult.Percent,
                        ForSelfStudy = test.ForSelfStudy,
                        ForNN = test.ForNN,
                        BeforeEUMK = test.BeforeEUMK,
                        ForEUMK = test.ForEUMK
                    };
                });

            return JsonResponse(results) as JsonResult;
        }

        [HttpPost]
        public JsonResult SaveNeuralNetwork(string data, int testId)
        {
            var test = this.TestsManagementService.GetTest(testId);
            test.Data = data;
            this.TestsManagementService.SaveTest(test, true);

            return this.Json("Ok");
        }

        [JwtAuth]
        [HttpGet]
        public JsonResult GetResults(int groupId, int subjectId)
        {
            var tests = this.TestsManagementService.GetTestsForSubject(subjectId)
                .Where(x => x.Title != AdaptiveConst.AdaptiveTestName);

            var subGroups = this.SubjectManagementService.GetSubGroupsV2(subjectId, groupId);

            var results = this.TestPassingService.GetPassTestResults(groupId, subjectId)
                .Select(x => TestResultItemListViewModel.FromStudent(x, tests, subGroups))
                .OrderBy(res => res.StudentName).ToArray();

            return JsonResponse(results) as JsonResult;
        }

        [JwtAuth]
        [HttpPost]
        public JsonResult GetResults(int[] groupsIds, int subjectId)
        {
            var tests = this.TestsManagementService.GetTestsForSubject(subjectId)
                .Where(x => x.Title != AdaptiveConst.AdaptiveTestName);

            var groupsWithSubGroups = groupsIds.AsParallel().Select(groupId1 => new
            {
                GroupId = groupId1,
                SubGroups = this.SubjectManagementService.GetSubGroupsV2(subjectId, groupId1)
            }).ToArray();

            var results = groupsWithSubGroups
                .AsParallel()
                .Select(obj => new
                {
                    obj.GroupId,
                    Results = this.TestPassingService.GetPassTestResults(obj.GroupId, subjectId)
                        .Select(x => TestResultItemListViewModel.FromStudent(x, tests, obj.SubGroups))
                        .OrderBy(res => res.StudentName).ToArray()
                }).ToArray();

            return JsonResponse(results) as JsonResult;
        }

        [HttpGet]
        public JsonResult GetUserAnswers(int studentId, int testId)
        {
            var userAnswers = this.TestPassingService.GetAnswersForEndedTest(testId, studentId);
            var test = this.TestsManagementService.GetTest(testId, true);

            dynamic result = new ExpandoObject();
            result.TestInfo = this.TestPassingService.GetTestPassResult(testId, studentId);
            result.UserAnswers = GetAnswersAsUserAnswer(userAnswers, test.Questions);

            return JsonResponse(result) as JsonResult;
        }

        [JwtAuth]
        [HttpGet]
        public JsonResult GetControlItems(int subjectId)
        {
            var passingResults = this.TestPassingService.GetRealTimePassingResults(subjectId)
                .Where(result => result.PassResults.Any()).ToArray();
            var groupedResults = passingResults.GroupBy(result => result.TestName).ToArray();

            var results = groupedResults.Select(result => new
            {
                Test = result.Key,
                Students = result.ToArray()
            }).ToArray();
            return JsonResponse(results) as JsonResult;
        }

        [HttpPost]
        public JsonResult AnswerQuestionAndGetNext(IEnumerable<AnswerViewModel> answers, int testId, int questionNumber)
        {
            this.TestPassingService.MakeUserAnswer(
                answers != null && answers.Any() ? answers.Select(answerModel => answerModel.ToAnswer()) : null,
                UserContext.CurrentUserId, testId, questionNumber);

            return this.Json("Ok");
        }

        [HttpPost]
        public JsonResult AnswerQuestionAndGetNextMobile(IEnumerable<AnswerViewModel> answers, int testId,
            int questionNumber, int userId)
        {


            this.TestPassingService.MakeUserAnswer(
                answers != null && answers.Any() ? answers.Select(answerModel => answerModel.ToAnswer()) : null, userId,
                testId, questionNumber);

            return this.Json("Ok");
        }

        [HttpGet]
        public JsonResult GetQuestionsInfo()
        {
            var questions = this.TestsManagementService.GetQuestions();

            var questionsLevel = questions.ToDictionary(e => e.Id, t => t.ComlexityLevel);

            var answers = this.TestQuestionPassingService.GetAll();

            var level = 0;
            var groups = answers.GroupBy(e => e.QuestionId).Select(e => new
            {
                idQuestion = e.Key,
                complexity = questionsLevel.TryGetValue(e.Key, out level) ? level : 0,
                weight = 1,
                rightAnswers = e.Count(x => x.Points > 0),
                wrongAnswers = e.Count(x => x.Points == 0)
            });


            return JsonResponse(groups) as JsonResult;
        }

        [JwtAuth]
        [HttpGet]
        public void GetResultsExcel(int groupId, int subjectId, bool forSelfStudy, string studentLogins = null, string testIds = null, string lang = null, int? timezoneOffset = null)
        {
            var excelLang = TestResultsExcelLocalization.NormalizeLang(lang);
            var tests = this.TestsManagementService.GetTestsForSubject(subjectId)
                .Where(x => x.ForSelfStudy == forSelfStudy)
                .ToList();

            var subGroups = this.SubjectManagementService.GetSubGroupsV2(subjectId, groupId);

            var results = this.TestPassingService.GetPassTestResults(groupId, subjectId)
                .Select(x => TestResultItemListViewModel.FromStudent(x, tests, subGroups))
                .OrderBy(res => res.StudentName)
                .ToArray();

            if (!string.IsNullOrWhiteSpace(studentLogins))
            {
                var loginSet = new HashSet<string>(
                    studentLogins.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                        .Select(s => s.Trim())
                        .Where(s => s.Length > 0),
                    StringComparer.OrdinalIgnoreCase);
                if (loginSet.Count > 0)
                {
                    results = results.Where(r => loginSet.Contains(r.Login)).ToArray();
                }
            }

            var testIdOrder = ParseTestIdsList(testIds);
            if (testIdOrder != null && testIdOrder.Count > 0)
            {
                foreach (var result in results)
                {
                    result.TestPassResults = this.BuildFilteredTestPassResults(result, testIdOrder, tests);
                }
            }

            var data = new SLExcelData
            {
                ApplyThinBorders = false,
                ApplyHeaderRowBorderOnly = true
            };

            if (results.Length == 0 || results[0].TestPassResults.Length == 0)
            {
                data.Headers.Add(TestResultsExcelLocalization.Get("NoData", excelLang));
                this.WriteResultsExcelResponse(data);
                return;
            }

            var rowsData = new List<List<string>>();

            foreach (var result in results)
            {
                var datas = new List<string> { result.StudentName };
                foreach (var pass in result.TestPassResults)
                {
                    datas.Add(FormatTestPassStartForExcel(pass, timezoneOffset));
                    datas.Add(FormatTestPassEndForExcel(pass, timezoneOffset));
                    datas.Add(FormatTestGradeForExcel(pass));
                }

                if (result.TestPassResults.Count(e => e.Points != null) > 0)
                {
                    var pointsSum =
                        Math.Round(
                            (decimal)result.TestPassResults.Sum(e => e.Points).Value /
                            result.TestPassResults.Count(e => e.Points != null), 0, MidpointRounding.AwayFromZero);
                    //var percentSum = Math.Round((decimal)result.TestPassResults.Sum(e => e.Percent).Value / result.TestPassResults.Count(e => e.Percent != null), 0);
                    //datas.Add(pointsSum + " (" + percentSum + "%)");

                    datas.Add(pointsSum.ToString());
                }
                else
                {
                    datas.Add(string.Empty);
                }

                rowsData.Add(datas);
            }

            var index = 0;
            var total = new List<string>
            {
                TestResultsExcelLocalization.Get("AverageRow", excelLang)
            };

            foreach (var _ in results[0].TestPassResults)
            {
                var count = 0;
                decimal sum = 0;
                foreach (var resultItemListViewModel in results)
                {
                    if (resultItemListViewModel.TestPassResults[index].Points != null)
                    {
                        count += 1;
                    }

                    if (resultItemListViewModel.TestPassResults[index].Percent != null)
                    {
                        sum += resultItemListViewModel.TestPassResults[index].Percent.Value;
                    }
                }

                index += 1;
                //total.Add((int)Math.Round(sumPoint/count, 0, MidpointRounding.AwayFromZero) + " (" + Math.Round(sum / count, 0) + "%)");
                if (count == 0)
                {
                    total.Add(string.Empty);
                    total.Add(string.Empty);
                    total.Add(string.Empty);
                }
                else
                {
                    var percent = sum / count;
                    var mark = Math.Round(percent / 10, 0);
                    total.Add(string.Empty);
                    total.Add(string.Empty);
                    total.Add($"{mark} ({Math.Round(percent, 0)}%)");
                }
            }

            total.Add(string.Empty);

            var testCount = results[0].TestPassResults.Length;
            data.SparseHeaderRows = BuildTestResultsSparseHeaders(results[0].TestPassResults, excelLang);
            data.HeaderMergeReferences = BuildTestResultsHeaderMerges(testCount);
            TestResultsExcelLayout.Apply(data, testCount);
            data.ApplyWrapTextToDataRows = true;
            var avgColIdx = 1 + (3 * testCount);
            var avgLetter = ToExcelColumnName(avgColIdx);
            data.HeaderCellStylesByReference = new Dictionary<string, uint>(StringComparer.OrdinalIgnoreCase)
            {
                { "A1", 3U },
                { "A2", 4U },
                { $"{avgLetter}1", 3U },
                { $"{avgLetter}2", 4U },
            };
            var totalRowIndex = 2U + (uint)rowsData.Count + 1U;
            var totalColumnCount = 2 + (3 * testCount);
            data.DataCellStylesByReference = new Dictionary<string, uint>(StringComparer.OrdinalIgnoreCase);
            for (var col = 0; col < totalColumnCount; col++)
            {
                data.DataCellStylesByReference[$"{ToExcelColumnName(col)}{totalRowIndex}"] = 6U;
            }
            data.DataRows.AddRange(rowsData);
            data.DataRows.Add(total);

            this.WriteResultsExcelResponse(data);
        }

        private static List<string> BuildTestResultsHeaderMerges(int testCount)
        {
            var merges = new List<string>();
            for (var i = 0; i < testCount; i++)
            {
                var c0 = 1 + (3 * i);
                var c1 = 3 + (3 * i);
                merges.Add($"{ToExcelColumnName(c0)}1:{ToExcelColumnName(c1)}1");
            }

            var avgCol = 1 + (3 * testCount);
            var avgLetter = ToExcelColumnName(avgCol);
            merges.Add("A1:A2");
            merges.Add($"{avgLetter}1:{avgLetter}2");
            return merges;
        }

        private static List<Dictionary<int, string>> BuildTestResultsSparseHeaders(
            TestResultItemListViewModel.TestPassResultViewModel[] tests,
            string lang)
        {
            var n = tests.Length;
            var avgCol = 1 + (3 * n);
            var row1 = new Dictionary<int, string>
            {
                [0] = TestResultsExcelLocalization.Get("Student", lang)
            };
            for (var i = 0; i < n; i++)
            {
                var title = tests[i].TestName;
                if (string.IsNullOrWhiteSpace(title))
                {
                    title = TestResultsExcelLocalization.Get("TestFallback", lang) + " " + (i + 1);
                }

                row1[1 + (3 * i)] = SplitTestTitleForExcel(title);
            }

            row1[avgCol] = TestResultsExcelLocalization.Get("AverageTests", lang);

            var row2 = new Dictionary<int, string>
            {
                [0] = "\u00A0",
                [avgCol] = "\u00A0",
            };
            for (var i = 0; i < n; i++)
            {
                row2[1 + (3 * i)] = TestResultsExcelLocalization.Get("StartDateTime", lang);
                row2[2 + (3 * i)] = TestResultsExcelLocalization.Get("EndDateTime", lang);
                row2[3 + (3 * i)] = TestResultsExcelLocalization.Get("Mark", lang);
            }

            return new List<Dictionary<int, string>> { row1, row2 };
        }

        private static string SplitTestTitleForExcel(string text)
        {
            const int maxLineLength = 30;
            const int maxLines = 3;

            if (string.IsNullOrWhiteSpace(text) || text.Contains("\n"))
            {
                return text;
            }

            if (text.Length <= maxLineLength)
            {
                return text;
            }

            var words = text.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
            var lines = new List<string>();
            var currentLine = string.Empty;
            var wordIndex = 0;

            while (wordIndex < words.Length && lines.Count < maxLines)
            {
                while (wordIndex < words.Length)
                {
                    var word = words[wordIndex];
                    var candidate = string.IsNullOrEmpty(currentLine) ? word : currentLine + " " + word;
                    if (candidate.Length > maxLineLength && !string.IsNullOrEmpty(currentLine))
                    {
                        break;
                    }

                    currentLine = candidate;
                    wordIndex++;
                }

                if (!string.IsNullOrEmpty(currentLine))
                {
                    lines.Add(currentLine);
                    currentLine = string.Empty;
                }
                else if (wordIndex < words.Length)
                {
                    lines.Add(words[wordIndex]);
                    wordIndex++;
                }
            }

            if (wordIndex < words.Length && lines.Count > 0)
            {
                var remainder = string.Join(" ", words.Skip(wordIndex));
                lines[lines.Count - 1] = lines[lines.Count - 1] + " " + remainder;
            }

            return string.Join("\n", lines);
        }

        private static string ToExcelColumnName(int columnIndex)
        {
            var intFirstLetter = (columnIndex / 676) + 64;
            var intSecondLetter = ((columnIndex % 676) / 26) + 64;
            var intThirdLetter = (columnIndex % 26) + 65;
            var firstLetter = (intFirstLetter > 64) ? (char)intFirstLetter : ' ';
            var secondLetter = (intSecondLetter > 64) ? (char)intSecondLetter : ' ';
            var thirdLetter = (char)intThirdLetter;
            return string.Concat(firstLetter, secondLetter, thirdLetter).Trim();
        }

        private void WriteResultsExcelResponse(SLExcelData data)
        {
            var file = new SLExcelWriter().GenerateExcel(data);

            this.Response.Clear();
            this.Response.Charset = "ru-ru";
            this.Response.HeaderEncoding = Encoding.UTF8;
            this.Response.ContentEncoding = Encoding.UTF8;
            this.Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            this.Response.AddHeader("Content-Disposition", "attachment; filename=TestResult.xlsx");
            this.Response.BinaryWrite(file);
            this.Response.Flush();
            this.Response.End();
        }

        private static List<int> ParseTestIdsList(string testIds)
        {
            if (string.IsNullOrWhiteSpace(testIds))
            {
                return null;
            }

            var list = testIds.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                .Select(p => p.Trim())
                .Where(p => p.Length > 0)
                .Select(p => int.TryParse(p, out var id) ? (int?)id : null)
                .Where(id => id.HasValue)
                .Select(id => id.Value)
                .ToList();
            return list.Count > 0 ? list : null;
        }

        private TestResultItemListViewModel.TestPassResultViewModel[] BuildFilteredTestPassResults(
            TestResultItemListViewModel result,
            IList<int> testIdOrder,
            IList<Test> testsMetadata)
        {
            var list = new List<TestResultItemListViewModel.TestPassResultViewModel>();
            var studentId = result.TestPassResults.Select(t => t.StudentId).FirstOrDefault();
            foreach (var testId in testIdOrder)
            {
                var existing = result.TestPassResults.FirstOrDefault(t => t.TestId == testId);
                if (existing != null)
                {
                    list.Add(existing);
                }
                else
                {
                    var testMeta = testsMetadata.FirstOrDefault(t => t.Id == testId);
                    list.Add(new TestResultItemListViewModel.TestPassResultViewModel
                    {
                        StudentId = studentId,
                        TestId = testId,
                        Points = null,
                        Percent = null,
                        StartTime = default,
                        EndTime = null,
                        TestName = testMeta != null ? testMeta.Title : string.Empty,
                        ForSelfStudy = testMeta != null ? testMeta.ForSelfStudy : true,
                        ForNN = testMeta != null ? testMeta.ForNN : false,
                        ForEUMK = testMeta != null ? testMeta.ForEUMK : true,
                        BeforeEUMK = testMeta != null ? testMeta.BeforeEUMK : true,
                        TestNumber = testMeta != null ? testMeta.TestNumber : null
                    });
                }
            }

            return list.ToArray();
        }

        private static string FormatTestGradeForExcel(TestResultItemListViewModel.TestPassResultViewModel e)
        {
            if (e.Points == null)
            {
                return string.Empty;
            }

            return e.Percent.HasValue
                ? $"{e.Points} ({e.Percent}%)" : e.Points.ToString();
        }

        private static string FormatTestPassStartForExcel(TestResultItemListViewModel.TestPassResultViewModel e, int? clientTimezoneOffsetMinutes)
        {
            if (e.StartTime == default(DateTime) || e.StartTime.Year <= 1)
            {
                return string.Empty;
            }

            var localTime = ConvertToClientLocal(e.StartTime, clientTimezoneOffsetMinutes);
            return localTime.ToString("dd.MM.yyyy") + "\n" + localTime.ToString("HH:mm");
        }

        private static string FormatTestPassEndForExcel(TestResultItemListViewModel.TestPassResultViewModel e, int? clientTimezoneOffsetMinutes)
        {
            if (!e.EndTime.HasValue || e.EndTime.Value.Year <= 1)
            {
                return string.Empty;
            }

            var localTime = ConvertToClientLocal(e.EndTime.Value, clientTimezoneOffsetMinutes);
            return localTime.ToString("dd.MM.yyyy") + "\n" + localTime.ToString("HH:mm");
        }

        private static DateTime ConvertToClientLocal(DateTime defTime, int? clientTimezoneOffsetMinutes)
        {
            if (!clientTimezoneOffsetMinutes.HasValue)
            {
                return defTime;
            }

            var defZone = TimeZoneInfo.FindSystemTimeZoneById("Russian Standard Time");
            var unspecified = DateTime.SpecifyKind(defTime, DateTimeKind.Unspecified);
            var utc = TimeZoneInfo.ConvertTimeToUtc(unspecified, defZone);
            return utc.AddMinutes(-clientTimezoneOffsetMinutes.Value);
        }

        private JsonResult GetCloseTestResult(int testId, int mark, int percent, UserAnswersCallback answersCallback, bool fillTestPassResult = false)
        {
            var test = this.TestsManagementService.GetTest(testId, true, true);

            var thems = new List<object>();

            foreach (var concept in test.Questions.Where(e => e.ConceptId.HasValue).Select(x => x.Concept).OrderBy(e => e.Id))
            {
                string filePath = null;
                var attachments = FilesManagementService.GetAttachments(concept.Container);
                var attachment = attachments.FirstOrDefault();

                if (attachment != null)
                {
                    filePath = $"{attachment.PathName}//{attachment.FileName}";
                }

                thems.Add(new { name = concept.Name, id = concept.Id, container = concept.Container, filePath });
            }

            var answers = this.TestPassingService.GetAnswersForEndedTest(testId, UserContext.CurrentUserId);

            dynamic results = new ExpandoObject();
            results.TestName = test.Title;
            results.Percent = percent;
            results.Mark = mark;
            results.Answers = answersCallback.Invoke(answers, test.Questions);
            results.Thems = thems;
            results.NeuralData = test.Data;
            results.FoNN = test.ForNN;

            if (fillTestPassResult)
            {
                var testPassResult = this.TestPassingService.GetTestPassResult(testId, UserContext.CurrentUserId);
                results.StartTime = testPassResult.StartTime;
                results.EndTime = testPassResult.EndTime;
                results.Comment = testPassResult.Comment;
            }

            return JsonResponse(results);
        }

        private IEnumerable<dynamic> GetAnswersAsBinary(List<AnswerOnTestQuestion> answers, ICollection<Question> questions)
        {
            return questions.OrderBy(e => e.ConceptId).ThenBy(e => e.Id).Select(x =>
            {
                var answer = answers.FirstOrDefault(e => e.QuestionId == x.Id);
                return (dynamic)(x != null && answer.Points > 0 ? 1 : 0);
            }).ToArray();
        }

        private IEnumerable<dynamic> GetAnswersAsUserAnswer(List<AnswerOnTestQuestion> answers, ICollection<Question> questions)
        {
            return answers.Select(x =>
            {
                var question = questions.FirstOrDefault(q => q.Id == x.QuestionId);

                return new UserAnswerViewModel
                {
                    Points = x.Points,
                    QuestionTitle = question.Title,
                    QuestionDescription = question.Description,
                    AnswerString = x.AnswerString,
                    Number = x.Number
                };
            })
            .OrderBy(x => x.Number)
            .ToList();
        }

        #region Dependencies

        public ITestPassingService TestPassingService => this.ApplicationService<ITestPassingService>();

        public ISubjectManagementService SubjectsManagementService =>
            this.ApplicationService<ISubjectManagementService>();

        public ITestsManagementService TestsManagementService => this.ApplicationService<ITestsManagementService>();

        public IGroupManagementService GroupManagementService => this.ApplicationService<IGroupManagementService>();

        private readonly LazyDependency<ITestQuestionPassingService> _testQuestionPassingService =
            new LazyDependency<ITestQuestionPassingService>();

        public ITestQuestionPassingService TestQuestionPassingService => this._testQuestionPassingService.Value;

        private readonly LazyDependency<ISubjectManagementService> subjectManagementService =
            new LazyDependency<ISubjectManagementService>();

        public ISubjectManagementService SubjectManagementService => this.subjectManagementService.Value;

        public IConceptManagementService ConceptManagementService =>
            this.ApplicationService<ConceptManagementService>();

        private delegate IEnumerable<dynamic> UserAnswersCallback(List<AnswerOnTestQuestion> answers, ICollection<Question> questions);

        #endregion
    }
}