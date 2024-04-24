using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Net;
using System.Text;
using System.Web.Mvc;
using Application.Core;
using Application.Core.Helpers;
using Application.Core.SLExcel;
using Application.Core.UI.Controllers;
using Application.Infrastructure.ConceptManagement;
using Application.Infrastructure.GroupManagement;
using Application.Infrastructure.KnowledgeTestsManagement;
using Application.Infrastructure.SubjectManagement;
using Application.Infrastructure.TestQuestionPassingManagement;
using Application.Infrastructure.UserManagement;
using Bootstrap;
using LMPlatform.Models.KnowledgeTesting;
using LMPlatform.UI.Attributes;
using LMPlatform.UI.ViewModels.KnowledgeTestingViewModels;
using Nest;
using Newtonsoft.Json;
using WebMatrix.WebData;

namespace LMPlatform.UI.Controllers
{
    [JwtAuth]
    public class TestPassingController : BasicController
    {
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
        public JsonResult GetTestDescription(int testId)
        {
            var test = this.TestsManagementService.GetTest(testId);
            var description = new
            {
              
                test.Title, test.Description, OngoingTestId = 0
               
            };
            int idUser = UserContext.CurrentUserId;
            var _context = new UsersManagementService();
            var user = _context.GetUserById(idUser);
            if (user.OngoingTest != null)
            {
                description = new
                {
                    Title = "Тест " + TestsManagementService.GetTest(user.OngoingTest.Value).Title + " уже запущен в Вашей учетной записи",
                    Description = "Завершите тест и попробуйте еще раз",
                    OngoingTestId = user.OngoingTest.Value
                };
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
            var availableTests = this.TestPassingService.GetAvailableTestsForStudent(userId, subjectId)
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

            if (excludeCorrectnessIndicator) result.Question.Answers.ForEach(a => a.СorrectnessIndicator = default);
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
            _context.UpdateUser(user);
            return JsonResponse(closeTestRes) as JsonResult;
        }

        [JwtAuth]
        [HttpGet]
        public JsonResult GetStudentResults(int subjectId)
        {
            var results = this.TestPassingService.GetStidentResults(subjectId, UserContext.CurrentUserId)
                .GroupBy(g => g.TestName)
                .Select(group => new
                {
                    Title = group.Key,
                    group.Last().Points,
                    group.Last().Percent,
                    this.TestsManagementService.GetTest(group.Last().TestId).ForSelfStudy,
                    this.TestsManagementService.GetTest(group.Last().TestId).ForNN,
                    this.TestsManagementService.GetTest(group.Last().TestId).BeforeEUMK,
                    this.TestsManagementService.GetTest(group.Last().TestId).ForEUMK
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
            var tests = this.TestsManagementService.GetTestsForSubject(subjectId);

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
            var tests = this.TestsManagementService.GetTestsForSubject(subjectId);

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
        public void GetResultsExcel(int groupId, int subjectId, bool forSelfStudy)
        {
            var tests = this.TestsManagementService.GetTestsForSubject(subjectId)
                .Where(x => x.ForSelfStudy == forSelfStudy);

            var subGroups = this.SubjectManagementService.GetSubGroupsV2(subjectId, groupId);

            var results = this.TestPassingService.GetPassTestResults(groupId, subjectId)
                .Select(x => TestResultItemListViewModel.FromStudent(x, tests, subGroups))
                .OrderBy(res => res.StudentName).ToArray();

            var data = new SLExcelData();

            var rowsData = new List<List<string>>();

            foreach (var result in results)
            {
                var datas = new List<string>();
                datas.Add(result.StudentName);
                datas.AddRange(result.TestPassResults.Select(e =>
                    e.Points != null ? $"{e.Points} ({e.Percent}%)" : string.Empty));
                if (result.TestPassResults.Count(e => e.Points != null) > 0)
                {
                    var pointsSum =
                        Math.Round(
                            (decimal) result.TestPassResults.Sum(e => e.Points).Value /
                            result.TestPassResults.Count(e => e.Points != null), 0, MidpointRounding.AwayFromZero);
                    //var percentSum = Math.Round((decimal)result.TestPassResults.Sum(e => e.Percent).Value / result.TestPassResults.Count(e => e.Percent != null), 0);
                    //datas.Add(pointsSum + " (" + percentSum + "%)");

                    datas.Add(pointsSum.ToString());
                }

                rowsData.Add(datas);
            }

            var index = 0;
            var total = new List<string>
            {
                "Средняя оценка (процент) за тест"
            };

            foreach (var testResultItemListViewModel in results[0].TestPassResults)
            {
                var count = 0;
                decimal sum = 0;
                decimal sumPoint = 0;
                foreach (var resultItemListViewModel in results)
                {
                    if (resultItemListViewModel.TestPassResults[index].Points != null)
                    {
                        count += 1;
                        sumPoint += resultItemListViewModel.TestPassResults[index].Points.Value;
                    }

                    if (resultItemListViewModel.TestPassResults[index].Percent != null)
                        sum += resultItemListViewModel.TestPassResults[index].Percent.Value;
                }

                index += 1;
                //total.Add((int)Math.Round(sumPoint/count, 0, MidpointRounding.AwayFromZero) + " (" + Math.Round(sum / count, 0) + "%)");
                var percent = sum / count;
                var mark = Math.Round(percent / 10, 0);
                total.Add($"{mark} ({Math.Round(percent, 0)}%)");
            }

            data.Headers.Add("Студент");
            data.Headers.AddRange(results[0].TestPassResults.Select(e => e.TestName));
            data.Headers.Add("Средняя оценка за тесты");
            data.DataRows.AddRange(rowsData);
            data.DataRows.Add(total);

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

        private JsonResult GetCloseTestResult(int testId, int mark, int percent, UserAnswersCallback answersCallback, bool fillTestPassResult = false)
        {
            var test = this.TestsManagementService.GetTest(testId, true, true);

            var thems = new List<object>();

            foreach (var concept in test.Questions.Where(e => e.ConceptId.HasValue).Select(x => x.Concept).OrderBy(e => e.Id))
            {
                thems.Add(new { name = concept.Name, id = concept.Id });
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