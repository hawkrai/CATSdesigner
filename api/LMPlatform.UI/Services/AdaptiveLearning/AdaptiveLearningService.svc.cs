using Application.Core;
using Application.Infrastructure.AdaptiveLearning;
using Application.Infrastructure.KnowledgeTestsManagement;
using LMPlatform.AdaptiveLearningCore;
using LMPlatform.AdaptiveLearningCore.Models;
using LMPlatform.AdaptiveLearningCore.Shared;
using LMPlatform.Models.AdaptivityLearning;
using LMPlatform.UI.Services.Modules;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Web.Helpers;
using System.Web.Mvc;

namespace LMPlatform.UI.Services.AdaptiveLearning
{
	// NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "AdaptiveLearningService" in code, svc and config file together.
	// NOTE: In order to launch WCF Test Client for testing this service, please select AdaptiveLearningService.svc or AdaptiveLearningService.svc.cs at the Solution Explorer and start debugging.
	public class AdaptiveLearningService : IAdaptiveLearningService
	{
		private const int NEEDED_QUSTIONS_COUNT = 10;

		private readonly LazyDependency<IAdaptiveLearning> adaptiveLearningService = new LazyDependency<IAdaptiveLearning>();
		private readonly LazyDependency<IQuestionsManagementService> questionsManagementService = new LazyDependency<IQuestionsManagementService>();
		private readonly LazyDependency<ITestsManagementService> testsManagementService = new LazyDependency<ITestsManagementService>();
		private readonly LazyDependency<ITestPassingService> testPassingService = new LazyDependency<ITestPassingService>();

		public IAdaptiveLearning AdaptiveLearningManagementService => adaptiveLearningService.Value;
		public IQuestionsManagementService QuestionsManagementService => questionsManagementService.Value;
		public ITestsManagementService TestsManagementService => testsManagementService.Value;
		public ITestPassingService TestPassingService => testPassingService.Value;

		public AdaptivityViewResult GetNextThema(int userId, int subjectId, int complexId, int currentThemaId)
		{
			var adaptivityProcessor = GetLearningProcessor(userId, complexId);
			if (adaptivityProcessor is null)
			{
				return new AdaptivityViewResult 
				{
					NextThemaId = null,
					NeedToDoPredTest = false,
					NeedToSelectAdaptivityType = true,
					Code = "500"
				};
			}

			var allAvailableThemas = AdaptiveLearningManagementService.GetAllAvaiableThemas(userId, complexId);
			if (!allAvailableThemas.Any())
			{
				return new AdaptivityViewResult
				{
					NextThemaId = null,
					NeedToDoPredTest = true,
					NeedToSelectAdaptivityType = false,
					Code = "500"
				};
			}


			var currentThemaTests = QuestionsManagementService.GetQuestionsByConceptId(currentThemaId).Select(x => x.TestId)
				.Distinct();

			int themaResult = 0;
			foreach (var themsTest in currentThemaTests)
			{
				var test = TestsManagementService.GetTest(themsTest);
				if (test.ForEUMK)
				{
					themaResult += TestPassingService
						.GetStidentResults(subjectId, userId)
						.FirstOrDefault(x => x.TestId == test.Id)
						.Points.Value;
										
				}
			}
			
			var currentRes = adaptivityProcessor.GetResultByCurrentThema(currentThemaId, themaResult, allAvailableThemas);

			AdaptiveLearningManagementService.SaveThemaResult(currentRes.ResultByCurrentThema, currentThemaId, userId);

			return new AdaptivityViewResult
			{
				NextThemaId = currentRes.NextThemaId,
				NeedToDoPredTest = false,
				NeedToSelectAdaptivityType = false,
				Code = "200"
			};
		}

		public void ProcessPredTestResults(int userId, int complexId)
		{
			var adaptivityProcessor = GetLearningProcessor(userId, complexId);
			
			var availableThemas = AdaptiveLearningManagementService
				.GetPredTestResults(complexId, userId)?
				.Select(x => new PredTestResults
				{
					ThemaId = x.ThemaId,
					ThemaResult = x.ThemaResult,
					ThemaResume = ThemaResume.NEED_TO_LEARN
				});
			
			adaptivityProcessor.ProcessPredTestResults(availableThemas);
			AdaptiveLearningManagementService.SaveProcessedPredTestResult(complexId, userId, availableThemas);
		}

		public JsonResult GetQuestionsForThema(int userId, int complexId, int monitoringRes)
		{
			var adaptivityProcessor = GetLearningProcessor(userId, complexId);
			var allQuestions = QuestionsManagementService
				.GetQuestionsByConceptId(complexId);
				
			var allTestQuestions = allQuestions.Select(x => new TestQuestion
				{
					TestQuestionId = x.Id,
					TestQuestionDificulty = GetTestDifficultyByComplexityLevel(x.ComlexityLevel)
				});

			var questionIds =  adaptivityProcessor.PrepareListOfTestQuestions(null, allTestQuestions, monitoringRes, 0, NEEDED_QUSTIONS_COUNT).ToArray();
			var selectedQuestions = allQuestions.Where(x => questionIds.Contains(x.Id));

			return null;
		}

		private TestsDifficulties GetTestDifficultyByComplexityLevel(int complexityLevel)
		{
			return Enum.GetValues(typeof(TestsDifficulties)).Cast<TestsDifficulties>().ElementAt(complexityLevel / 2);
		}
		
		private AdaptiveLearningProcessor GetLearningProcessor(int userId, int complexId)
		{
			var adaptivityType = AdaptiveLearningManagementService.GetAdaptivityType(complexId, userId);			

			return adaptivityType is null ? null : new AdaptiveLearningProcessor(adaptivityType.Value);
		}

		public void SaveSelectedAdaptivityType(int userId, int complexId, int adaptivityType)
		{
			throw new NotImplementedException();
		}
	}
}
