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

		public AdaptivityViewResult GetNextThema(int userId, int subjectId, int testId, int adaptivityType)
		{
			var adaptivityProcessor = GetLearningProcessor(adaptivityType);
			
			var allAvailableThemas = AdaptiveLearningManagementService.GetAllAvaiableThemas(subjectId, userId);
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
			
			
			var currentRes = adaptivityProcessor.GetResultByCurrentThema(1, themaResult, allAvailableThemas);

			AdaptiveLearningManagementService.SaveThemaResult(currentRes.ResultByCurrentThema, 1, userId);
			var nextConcept = ConceptManagementService.GetLiteById(currentRes.NextThemaId.Value);
			return new AdaptivityViewResult
			{
				NextThemaId = currentRes.NextThemaId,
				NextMaterialPath = GetFilePath(nextConcept),
				NeedToDoPredTest = false,
				Code = "200"
			};
		}

		public void ProcessPredTestResults(int userId, int testId, int adaptivityType)
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
			AdaptiveLearningManagementService.SaveProcessedPredTestResult(testId, userId, availableThemas);
		}

		public int GetDynamicTestIdForThema(int userId, int subjectId, int complexId, int monitoringRes, int adaptivityType)
		{
			var adaptivityProcessor = GetLearningProcessor(adaptivityType);
			var allQuestions = QuestionsManagementService
				.GetQuestionsByConceptId(complexId);
				
			var allTestQuestions = allQuestions.Select(x => new TestQuestion
				{
					TestQuestionId = x.Id,
					TestQuestionDificulty = GetTestDifficultyByComplexityLevel(x.ComlexityLevel)
				});

			var questionIds =  adaptivityProcessor.PrepareListOfTestQuestions(null, allTestQuestions, monitoringRes, 0, NEEDED_QUSTIONS_COUNT).ToArray();

			var dynamicTestId = AdaptiveLearningManagementService.CreateDynamicTestForUser(subjectId);
			QuestionsManagementService.CopyQuestionsToTest(dynamicTestId, questionIds);

			return dynamicTestId;
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
