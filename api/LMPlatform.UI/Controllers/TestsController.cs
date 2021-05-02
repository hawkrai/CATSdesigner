using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using Application.Core.Data;
using Application.Core.Helpers;
using Application.Core.UI.Controllers;
using Application.Infrastructure.ConceptManagement;
using Application.Infrastructure.GroupManagement;
using Application.Infrastructure.KnowledgeTestsManagement;
using Application.Infrastructure.StudentManagement;
using Application.Infrastructure.SubjectManagement;
using LMPlatform.Models;
using LMPlatform.UI.Attributes;
using LMPlatform.UI.Services.Modules.Concept;
using LMPlatform.UI.ViewModels.KnowledgeTestingViewModels;
using LMPlatform.UI.ViewModels.SubjectViewModels;
using WebMatrix.WebData;

namespace LMPlatform.UI.Controllers
{
    [JwtAuth]
    public class TestsController : BasicController
    {
        public string TestContentPath => ConfigurationManager.AppSettings["TestContentPath"];

        protected int CurrentUserId => int.Parse(UserContext.CurrentUserId.ToString(CultureInfo.InvariantCulture));

        //[OverrideAuthorization]
        //[JwtAuth(Roles = "lector")]
        //[System.Web.Http.HttpGet]
        //public ActionResult KnowledgeTesting(int subjectId)
        //{
        //    if (!this.User.IsInRole("lector")) return StatusCode(HttpStatusCode.BadRequest);

        //    var subject = this.SubjectsManagementService.GetSubject(subjectId);
        //    return this.View("KnowledgeTesting", subject);
        //}

        [System.Web.Http.HttpPost]
        public JsonResult UploadFile(HttpPostedFileBase file)
        {
            try
            {
                byte[] fileContent = null;

                using (var memoryStream = new MemoryStream())
                {
                    file.InputStream.CopyTo(memoryStream);
                    fileContent = memoryStream.ToArray();
                }

                var fileName = this.TestContentPath + Guid.NewGuid().ToString("N") + Path.GetExtension(file.FileName);

                System.IO.File.WriteAllBytes(fileName, fileContent);

                return null;
            }
            catch (Exception e)
            {
                return this.Json(new {ErrorMessage = e.Message});
            }
        }

        [System.Web.Http.HttpGet]
        public JsonResult GetFiles()
        {
            try
            {
                var url = this.Request.Url.Authority;

                var dirs = Directory.GetFiles(this.TestContentPath);

                return this.Json(dirs.Select(e => new
                {
                    Url = "http://" + url + "/UploadedTestFiles/" + Path.GetFileName(e)
                }).ToList(), JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return this.Json(new {ErrorMessage = e.Message});
            }
        }

        public JsonResult GetTests(int? subjectId)
        {
            var tests = this.TestsManagementService.GetTestsForSubject(subjectId);
            var testViewModels = tests.Select(TestItemListViewModel.FromTest).OrderBy(x => x.TestNumber);

            return this.Json(testViewModels, JsonRequestBehavior.AllowGet);
        }

        [System.Web.Http.HttpGet]
        public int GetEUMKPredTestIdForSubject(int subjectId)
        {
            return this.TestsManagementService.GetTestsForSubject(subjectId).FirstOrDefault(x => x.BeforeEUMK)?.Id ?? -1;
        }

        public JsonResult GetRecomendations(int subjectId)
        {
            var result = new List<object>();
            var predTest = this.TestsManagementService.GetTestsForSubject(subjectId).FirstOrDefault(x => x.BeforeEUMK);
            if (predTest != null)
            {
                var predTestResult = this.TestPassingService.GetStidentResults(subjectId, this.CurrentUserId)
                    .FirstOrDefault(x => x.TestId == predTest.Id);
                if (predTestResult?.Points == null)
                    return this.Json(new object[]
                    {
                        new {IsTest = true, predTest.Id, Text = "Пройдите предтест"}
                    }, JsonRequestBehavior.AllowGet);
            }

            foreach (var recommendedConcept in this.GetMaterialsRecomendations(predTest.Id, 0))
            {
                if (recommendedConcept != null && recommendedConcept.Concept != null)
                {
                    var testIds = this.GetTestForEUMKConcept(recommendedConcept.Concept.Id, subjectId, 0);
                    if (testIds != null && testIds.Any())
                    {
                        result.Add(new
                        {
                            IsTest = false, recommendedConcept.Concept.Id, Text = "Рекомендуемый для прочтения материал"
                        });
                        if (testIds != null && testIds.Any())
                        {
                            foreach (var testId in testIds)
                                result.Add(new {IsTest = true, Id = testId, Text = "Пройдите тест!"});
                            return this.Json(result, JsonRequestBehavior.AllowGet);
                        }
                    }
                }
            }

            return this.Json(result, JsonRequestBehavior.AllowGet);
        }

        [System.Web.Http.AllowAnonymous]
        public JsonResult GetRecomendationsMobile(int subjectId, int userId)
        {
            var result = new List<object>();
            var predTest = this.TestsManagementService.GetTestsForSubject(subjectId).FirstOrDefault(x => x.BeforeEUMK);
            if (predTest != null)
            {
                var predTestResult = this.TestPassingService.GetStidentResults(subjectId, userId)
                    .FirstOrDefault(x => x.TestId == predTest.Id);
                if (predTestResult?.Points == null)
                    return this.Json(new object[]
                    {
                        new {IsTest = true, predTest.Id, Text = "Пройдите предтест"}
                    }, JsonRequestBehavior.AllowGet);
            }

            foreach (var recommendedConcept in this.GetMaterialsRecomendations(predTest.Id, userId))
            {
                if (recommendedConcept != null && recommendedConcept.Concept != null)
                {
                    var testIds = this.GetTestForEUMKConcept(recommendedConcept.Concept.Id, subjectId, userId);
                    if (testIds != null && testIds.Any())
                    {
                        result.Add(new
                        {
                            IsTest = false, recommendedConcept.Concept.Id, Text = "Рекомендуемый для прочтения материал"
                        });
                        foreach (var testId in testIds)
                            result.Add(new {IsTest = true, Id = testId, Text = "Пройдите тест!"});
                        return this.Json(result, JsonRequestBehavior.AllowGet);
                    }
                }
            }

            return this.Json(result, JsonRequestBehavior.AllowGet);
        }

        private IEnumerable<int> GetTestForEUMKConcept(int conceptId, int subjectId, int userId)
        {
            var testIds = this.QuestionsManagementService.GetQuestionsByConceptId(conceptId).Select(x => x.TestId)
                .Distinct();

            foreach (var testId in testIds)
            {
                var test = this.TestsManagementService.GetTest(testId);
                if (test.ForEUMK)
                {
                    var testResult = this.TestPassingService
                        .GetStidentResults(subjectId, userId == 0 ? this.CurrentUserId : userId)
                        .FirstOrDefault(x => x.TestId == test.Id);

                    if (testResult == null)
                        yield return test.Id;
                    else if (testResult.Points == null || testResult.Points < 10)
                        yield return test.Id;
                }
            }
        }

        private IList<ConceptResult> GetMaterialsRecomendations(int predTestId, int userId)
        {
            IList<ConceptResult> result = new List<ConceptResult>();
            try
            {
                var test = this.TestsManagementService.GetTest(predTestId, true);
                if (test.Questions != null)
                    foreach (var question in test.Questions)
                        if (question.ConceptId.HasValue)
                        {
                            var points =
                                this.TestPassingService.GetPointsForQuestion(userId == 0 ? this.CurrentUserId : userId,
                                    question.Id);
                            if (points == 0 || points == null)
                            {
                                var concept = this.ConceptManagementService.GetById(question.ConceptId.Value);
                                result.Add(new ConceptResult
                                {
                                    Concept = new ConceptViewData(concept)
                                });
                            }
                        }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }

            return result;
        }

        [System.Web.Http.HttpGet]
        public JsonResult GetTest(int id)
        {
            var test = id == 0
                ? new TestViewModel()
                : TestViewModel.FromTest(this.TestsManagementService.GetTest(id));

            return this.Json(test, JsonRequestBehavior.AllowGet);
        }

        [System.Web.Http.HttpPost]
        public JsonResult SaveTest(TestViewModel testViewModel)
        {
            try
            {
                var savedTest = this.TestsManagementService.SaveTest(testViewModel.ToTest());
                return this.Json(savedTest);
            }
            catch (Exception e)
            {
                return this.Json(new {ErrorMessage = e.Message});
            }
        }

        [System.Web.Http.HttpPatch]
        public JsonResult OrderQuestions([FromBody] Dictionary<string, int> newOrder)
        {
            try
            {
                foreach (var item in newOrder)
                {
                    var questionId = int.Parse(item.Key);
                    this.QuestionsManagementService.ChangeQuestionNumber(questionId, item.Value);
                }

                return this.Json("Ok");
            }
            catch (Exception e)
            {
                return this.Json(new {ErrorMessage = e.Message});
            }
        }

        [System.Web.Http.HttpPatch]
        public JsonResult OrderTests([FromBody] Dictionary<string, int> newOrder)
        {
            try
            {
                foreach (var item in newOrder)
                {
                    var testId = int.Parse(item.Key);
                    this.QuestionsManagementService.ChangeTestNumber(testId, item.Value);
                }

                return this.Json("Ok");
            }
            catch (Exception e)
            {
                return this.Json(new {ErrorMessage = e.Message});
            }
        }

        [System.Web.Http.HttpDelete]
        public JsonResult DeleteTest(int id)
        {
            this.TestsManagementService.DeleteTest(id);
            return this.Json(id);
        }

        public ActionResult UnlockTests(int[] studentIds, int testId, bool unlock)
        {
            this.TestsManagementService.UnlockTest(studentIds, testId, unlock);
            return this.Json("Ok");
        }

        [System.Web.Http.HttpPost]
        public ActionResult ChangeLockForUserForStudent(int testId, int studentId, bool unlocked)
        {
            this.TestsManagementService.UnlockTestForStudent(testId, studentId, unlocked);
            if (!unlocked) return this.Json("Ok");
            var passedByUser = this.TestPassingService.GetTestPassingTime(testId, studentId);
            if (passedByUser == null) return this.Json("Ok");
            var student = this.StudentManagementService.GetStudent(studentId);
            return this.Json(new
            {
                PassedTime = passedByUser.StartTime.ToShortDateString(),
                Test = this.TestsManagementService.GetTest(testId).Title,
                Student = $"{student.FirstName} {student.LastName}",
                passedByUser.Points
            });
        }

        [System.Web.Http.HttpGet]
        public JsonResult GetTestForLector()
        {
            var tests = this.TestsManagementService.GetTestForLector(this.CurrentUserId);
            var testViewModels = tests.Select(TestViewModel.FromTest).OrderBy(t => t.Title).ToList();
            testViewModels.Add(new TestViewModel
            {
                Id = 0,
                Title = "Все тесты"
            });

            return this.Json(testViewModels, JsonRequestBehavior.AllowGet);
        }

        [System.Web.Http.HttpGet]
        public JsonResult GetQuestionsFromAnotherTests(int testId)
        {
            var questions = this.TestsManagementService.GetQuestionsFromAnotherTests(testId, this.CurrentUserId);
            var questionViewModels = questions.Select(QuestionViewModel.FromQuestion).ToList();

            return this.Json(questionViewModels, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetGroups(int subjectId)
        {
            var subject = this.SubjectsManagementService.GetSubject(subjectId);
            var groupIds = subject.SubjectGroups.Where(x => x.IsActiveOnCurrentGroup)
                .Select(subjectGroup => subjectGroup.GroupId).ToArray();
            var groups = this.GroupManagementService.GetGroups(new Query<Group>(group => groupIds.Contains(group.Id)))
                .Select(group => new
                {
                    group.Id, group.Name
                }).ToArray();

            return this.Json(groups, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSubGroups(int groupId, int subjectId, int testId)
        {
            var testUnlocks = this.TestsManagementService.GetTestUnlocksForTest(groupId, testId);

            var test = this.SubjectsManagementService.GetSubGroupsV3(subjectId, groupId);

            var subgroups = test.Select(subGroup => new
            {
                subGroup.Name,
                Students = subGroup.SubjectStudents.Where(e =>
                    e.Student.GroupId == groupId && (e.Student.Confirmed == null || e.Student.Confirmed.Value)).Select(
                    student => new
                    {
                        Id = student.StudentId,
                        Name = student.Student.FullName,
                        Unlocked = testUnlocks.FirstOrDefault(e => e.StudentId == student.StudentId) != null
                            ? testUnlocks.Single(unlock => unlock.StudentId == student.StudentId).Unlocked
                            : false
                    }).OrderBy(student => student.Name).ToArray()
            }).ToArray();

            return this.Json(subgroups, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Subjects(int subjectId)
        {
            var s = this.SubjectsManagementService.GetUserSubjects(UserContext.CurrentUserId).Where(e => !e.IsArchive);
            var CourseProjectSubjects = s.Where(cs =>
                    this.ModulesManagementService.GetModules(cs.Id).Any(m => m.ModuleType == ModuleType.SmartTest))
                .Select(e => new SubjectViewModel(e)).ToList();
            return JsonResponse(CourseProjectSubjects);
        }

        #region Questions

        [System.Web.Http.HttpGet]
        public JsonResult GetQuestions(int testId)
        {
            var questions = this.QuestionsManagementService.GetQuestionsForTest(testId)
                .Select(QuestionItemListViewModel.FromQuestion).OrderBy(x => x.QuestionNumber).ToArray();
            return this.Json(questions, JsonRequestBehavior.AllowGet);
        }

        [System.Web.Http.HttpGet]
        public JsonResult GetQuestion(int id)
        {
            var test = id == 0
                ? new QuestionViewModel {Answers = new[] {new AnswerViewModel {IsCorrect = 0}}, ComplexityLevel = 1}
                : QuestionViewModel.FromQuestion(this.QuestionsManagementService.GetQuestion(id));
            return this.Json(test, JsonRequestBehavior.AllowGet);
        }

        [System.Web.Http.HttpGet]
        public JsonResult GetConcepts(int subjectId)
        {
            var concepts = this.ConceptManagementService.GetRootTreeElementsBySubject(subjectId);
            var result = concepts.Select(c => new ConceptViewData(c, true,
                concept => concept.IsGroup && !this.ConceptManagementService.IsTestModule(concept.Name)));
            return this.Json(result, JsonRequestBehavior.AllowGet);
        }

        [System.Web.Http.HttpDelete]
        public JsonResult DeleteQuestion(int id)
        {
            this.QuestionsManagementService.DeleteQuestion(id);
            return this.Json(id);
        }

        [System.Web.Http.HttpPost]
        public JsonResult SaveQuestion(QuestionViewModel questionViewModel)
        {
            try
            {
                var test = this.TestsManagementService.GetTest(questionViewModel.TestId, true);
                if (test.ForEUMK)
                {
                    if (questionViewModel.ConceptId == null)
                    {
                        var questions = this.QuestionsManagementService.GetQuestionsForTest(questionViewModel.TestId)
                            .ToArray();
                        if (questions.Length > 0) questionViewModel.ConceptId = questions.First().ConceptId;
                    }
                    else
                    {
                        foreach (var questionId in test.Questions.Select(x => x.Id))
                        {
                            var question = this.QuestionsManagementService.GetQuestion(questionId);
                            question.ConceptId = questionViewModel.ConceptId;
                            this.QuestionsManagementService.SaveQuestion(question);
                        }
                    }
                }

                var savedQuestion = this.QuestionsManagementService.SaveQuestion(questionViewModel.ToQuestion());

                return this.Json(QuestionViewModel.FromQuestion(savedQuestion));
            }
            catch (Exception e)
            {
                return this.Json(new {ErrorMessage = e.Message});
            }
        }

        [System.Web.Http.HttpPost]
        public JsonResult AddQuestionsFromAnotherTest(int[] questionItems, int testId)
        {
            try
            {
                this.QuestionsManagementService.CopyQuestionsToTest(testId, questionItems);

                return this.Json("Ok");
            }
            catch (Exception e)
            {
                return this.Json(new {ErrorMessage = e.Message});
            }
        }

        #endregion

        #region Dependencies

        public IModulesManagementService ModulesManagementService =>
            this.ApplicationService<IModulesManagementService>();

        public ITestsManagementService TestsManagementService => this.ApplicationService<ITestsManagementService>();

        public IQuestionsManagementService QuestionsManagementService =>
            this.ApplicationService<IQuestionsManagementService>();

        public ITestPassingService TestPassingService => this.ApplicationService<ITestPassingService>();

        public ISubjectManagementService SubjectsManagementService =>
            this.ApplicationService<ISubjectManagementService>();

        public IGroupManagementService GroupManagementService => this.ApplicationService<IGroupManagementService>();

        public IStudentManagementService StudentManagementService =>
            this.ApplicationService<StudentManagementService>();

        public IConceptManagementService ConceptManagementService =>
            this.ApplicationService<ConceptManagementService>();

        #endregion
    }
}