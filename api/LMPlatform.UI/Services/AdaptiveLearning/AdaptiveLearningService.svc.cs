using Application.Core;
using Application.Infrastructure.AdaptiveLearning;
using Application.Infrastructure.ConceptManagement;
using Application.Infrastructure.FilesManagement;
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

		private readonly LazyDependency<Application.Infrastructure.AdaptiveLearning.IAdaptiveLearningService> adaptiveLearningService = new LazyDependency<Application.Infrastructure.AdaptiveLearning.IAdaptiveLearningService>();
		private readonly LazyDependency<IQuestionsManagementService> questionsManagementService = new LazyDependency<IQuestionsManagementService>();
		private readonly LazyDependency<ITestsManagementService> testsManagementService = new LazyDependency<ITestsManagementService>();
		private readonly LazyDependency<ITestPassingService> testPassingService = new LazyDependency<ITestPassingService>();
		private readonly LazyDependency<IConceptManagementService> _conceptManagementService = new LazyDependency<IConceptManagementService>(); 
		private readonly LazyDependency<IFilesManagementService> _filesManagementService =
			 new LazyDependency<IFilesManagementService>();

		public IFilesManagementService FilesManagementService => _filesManagementService.Value;
		public Application.Infrastructure.AdaptiveLearning.IAdaptiveLearningService AdaptiveLearningManagementService => adaptiveLearningService.Value;
		public IQuestionsManagementService QuestionsManagementService => questionsManagementService.Value;
		public ITestsManagementService TestsManagementService => testsManagementService.Value;
		public ITestPassingService TestPassingService => testPassingService.Value;
		public IConceptManagementService ConceptManagementService => _conceptManagementService.Value;

		public AdaptivityViewResult GetNextThema(int userId, int subjectId, int testId, int currentThemaId, int adaptivityType)
		{
			var adaptivityProcessor = GetLearningProcessor(adaptivityType);
			
			var allAvailableThemas = AdaptiveLearningManagementService.GetAllAvaiableThemas(subjectId, adaptivityType, userId);
			if (allAvailableThemas is null || !allAvailableThemas.Any())
			{
				return new AdaptivityViewResult
				{
					NextThemaId = null,
					NextMaterialPath = null,
					NeedToDoPredTest = true,
					Code = "500"
				};
			}		

			int themaResult = AdaptiveLearningManagementService.GeDynamicTestResult(testId, userId);
			
			
			var currentRes = adaptivityProcessor.GetResultByCurrentThema(currentThemaId, themaResult, allAvailableThemas);

			AdaptiveLearningManagementService.SaveThemaResult(currentRes.ResultByCurrentThema, currentRes.NextStepSolution, currentThemaId, adaptivityType, userId);
			AdaptiveLearningManagementService.ClearDynamicTestData(testId);

			if (currentRes.NextStepSolution == ThemaSolutions.END_PROCCESS)
			{
				return new AdaptivityViewResult
				{
					NextThemaId = null,
					NextMaterialPath = null,
					NeedToDoPredTest = false,
					IsLearningEnded = true,
					Code = "200"
				};
			}
			
			var nextConcept = ConceptManagementService.GetLiteById(currentRes.NextThemaId.Value);
			return new AdaptivityViewResult
			{
				NextThemaId = currentRes.NextThemaId,
				NextMaterialPath = GetFilePath(nextConcept),
				NeedToDoPredTest = false,
				ShouldWaitBeforeTest = currentRes.NextStepSolution == ThemaSolutions.REPEAT_CURRENT,
				TimeToWait = 10,
				Code = "200"
			};
		}

		public AdaptivityViewResult ProcessPredTestResults(int userId, int testId, int adaptivityType)
		{
			var adaptivityProcessor = GetLearningProcessor(adaptivityType);
			
			var availableThemas = AdaptiveLearningManagementService
				.GetPredTestResults(testId, userId)?
				.Select(x => new PredTestResults
				{
					ThemaId = x.ThemaId,
					ThemaResult = x.ThemaResult,
					ThemaResume = ThemaResume.NEED_TO_LEARN
				});
			
			adaptivityProcessor.ProcessPredTestResults(availableThemas);
			AdaptiveLearningManagementService.SaveProcessedPredTestResult(testId, userId, adaptivityType, availableThemas);

			var first = availableThemas.First();
			var firstConcept = ConceptManagementService.GetLiteById(first.ThemaId);

			return new AdaptivityViewResult
			{
				NextThemaId = first.ThemaId,
				NextMaterialPath = GetFilePath(firstConcept),
				NeedToDoPredTest = false,
				Code = "200"
			};
		}

		public int GetDynamicTestIdForThema(int userId, int subjectId, int complexId, int monitoringRes, int adaptivityType)
		{
			var adaptivityProcessor = GetLearningProcessor(adaptivityType);
			var allQuestions = QuestionsManagementService
				.GetQuestionsByConceptId(complexId)
				.GroupBy(x => x.Title)
				.Select(x => new { x.First().Id, x.First().ComlexityLevel });// This workaround is necessary because of wrong table behaviour
				
			var allTestQuestions = allQuestions.Select(x => new TestQuestion
				{
					TestQuestionId = x.Id,
					TestQuestionDificulty = GetTestDifficultyByComplexityLevel(x.ComlexityLevel)
				});

			var prevThemas = AdaptiveLearningManagementService
				.GetAllAvaiableThemas(subjectId, adaptivityType, userId)
				.Where(x => x.FinalThemaResult.HasValue)
				.Select(x => new ThemaResult() 
				{
					ThemaId = x.ThemaId,
					ResultByCurrentThema = x.FinalThemaResult.Value,
					NextStepSolution = ThemaSolutions.GET_NEXT
				})
				.ToList();

			var questionIds =  adaptivityProcessor.PrepareListOfTestQuestions(prevThemas, allTestQuestions, monitoringRes, 0, NEEDED_QUSTIONS_COUNT).ToArray();

			var dynamicTestId = AdaptiveLearningManagementService.CreateDynamicTestForUser(subjectId, NEEDED_QUSTIONS_COUNT);
			QuestionsManagementService.CopyQuestionsToTest(dynamicTestId, questionIds);

			return dynamicTestId;
		}

		public AdaptivityViewResult GetFirstThema(int userId, int subjectId, int adaptivityType)
		{
			var allAvailableThemas = AdaptiveLearningManagementService.GetAllAvaiableThemas(subjectId, adaptivityType, userId);
			if (allAvailableThemas is null || !allAvailableThemas.Any())
			{
				return new AdaptivityViewResult
				{
					NextThemaId = null,
					NextMaterialPath = null,
					NeedToDoPredTest = true,
					Code = "500"
				};
			}
			var first = allAvailableThemas.FirstOrDefault(x => x.ThemaResume == ThemaResume.NEED_TO_LEARN);
			if (first is null)
			{
				return new AdaptivityViewResult
				{
					NextThemaId = null,
					NextMaterialPath = null,
					NeedToDoPredTest = false,
					IsLearningEnded = true,
					Code = "200"
				};
			}

			var firstConcept = ConceptManagementService.GetLiteById(first.ThemaId);

			return new AdaptivityViewResult
			{
				NextThemaId = first.ThemaId,
				NextMaterialPath = GetFilePath(firstConcept),
				NeedToDoPredTest = false,
				Code = "200"
			};
		}

		private TestsDifficulties GetTestDifficultyByComplexityLevel(int complexityLevel)
		{
			return Enum.GetValues(typeof(TestsDifficulties)).Cast<TestsDifficulties>().ElementAt(complexityLevel / 2);
		}
		
		private AdaptiveLearningProcessor GetLearningProcessor(int adaptiivtyType)
		{
			var adaptivityType = (AdaptivityType)Enum.GetValues(typeof(AdaptivityType)).GetValue(adaptiivtyType - 1);			

			return new AdaptiveLearningProcessor(adaptivityType);
		}

		private string GetFilePath(LMPlatform.Models.Concept concept)
		{
			var attach = FilesManagementService.GetAttachments(concept.Container).FirstOrDefault();
			if (attach == null) return string.Empty;
			return  $"{attach.PathName}//{ attach.FileName}";
		}

		
	}
}
