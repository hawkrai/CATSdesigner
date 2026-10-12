using Application.Core;
using Application.Infrastructure.AdaptiveLearning;
using Application.Infrastructure.ConceptManagement;
using Application.Infrastructure.FilesManagement;
using Application.Infrastructure.KnowledgeTestsManagement;
using Application.Infrastructure.WatchingTimeManagement;
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
using LMPlatform.UI.Attributes;
using Application.Core.Constants;
using Application.Core.Helpers;
using LMPlatform.UI.Services.Modules.Concept;

namespace LMPlatform.UI.Services.AdaptiveLearning
{
    [JwtAuth]
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "AdaptiveLearningService" in code, svc and config file together.
    // NOTE: In order to launch WCF Test Client for testing this service, please select AdaptiveLearningService.svc or AdaptiveLearningService.svc.cs at the Solution Explorer and start debugging.
    public class AdaptiveLearningService : IAdaptiveLearningService
	{
		private const int NEEDED_QUSTIONS_COUNT = 10;
		private const int DEFAULT_SECONDS_FOR_QUESTION = 45;
		private const int NO_TEST_ID = -1;

		private readonly LazyDependency<Application.Infrastructure.AdaptiveLearning.IAdaptiveLearningService> adaptiveLearningService = new LazyDependency<Application.Infrastructure.AdaptiveLearning.IAdaptiveLearningService>();
		private readonly LazyDependency<IQuestionsManagementService> questionsManagementService = new LazyDependency<IQuestionsManagementService>();
		private readonly LazyDependency<ITestsManagementService> testsManagementService = new LazyDependency<ITestsManagementService>();
		private readonly LazyDependency<ITestPassingService> testPassingService = new LazyDependency<ITestPassingService>();
		private readonly LazyDependency<IConceptManagementService> _conceptManagementService = new LazyDependency<IConceptManagementService>(); 
		private readonly LazyDependency<IWatchingTimeService> _watchingTimeService = new LazyDependency<IWatchingTimeService>();
		private readonly LazyDependency<IFilesManagementService> _filesManagementService =
			 new LazyDependency<IFilesManagementService>();

		public IFilesManagementService FilesManagementService => _filesManagementService.Value;
		public Application.Infrastructure.AdaptiveLearning.IAdaptiveLearningService AdaptiveLearningManagementService => adaptiveLearningService.Value;
		public IQuestionsManagementService QuestionsManagementService => questionsManagementService.Value;
		public ITestsManagementService TestsManagementService => testsManagementService.Value;
		public ITestPassingService TestPassingService => testPassingService.Value;
		public IConceptManagementService ConceptManagementService => _conceptManagementService.Value;
		public IWatchingTimeService WatchingTimeService => _watchingTimeService.Value;

		public AdaptivityViewResult GetNextThema(int userId, int subjectId, int testId, int currentThemaId, int adaptivityType, int eumkRootConceptId)
		{
			var adaptivityProcessor = GetLearningProcessor(adaptivityType);

			var allAvailableThemas = AdaptiveLearningManagementService.GetAllAvaiableThemas(subjectId, adaptivityType, userId);
			allAvailableThemas = FilterThemasByEumk(allAvailableThemas, eumkRootConceptId);
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
				LockPredTestAfterLearning(subjectId, eumkRootConceptId, userId);
				return new AdaptivityViewResult
				{
					NextThemaId = null,
					NextMaterialPath = null,
					NeedToDoPredTest = false,
					IsLearningEnded = true,
					Code = "200"
				};
			}
			
			
			return new AdaptivityViewResult
			{
				NextThemaId = currentRes.NextThemaId,
				NextMaterialPath = GetNextThemaPath(currentRes.NextThemaId.Value, eumkRootConceptId, out int timeToWait),
				NeedToDoPredTest = false,
				ShouldWaitBeforeTest = currentRes.NextStepSolution == ThemaSolutions.REPEAT_CURRENT,
				TimeToWait = timeToWait,
				Code = "200"
			};
		}

		public AdaptivityViewResult ProcessPredTestResults(int userId, int testId, int adaptivityType, int eumkRootConceptId)
		{
			var adaptivityProcessor = GetLearningProcessor(adaptivityType);

			var eumkConceptIds = GetEumkConceptIds(eumkRootConceptId);
			var availableThemas = AdaptiveLearningManagementService
				.GetPredTestResults(testId, userId)?
				.Where(x => eumkConceptIds == null || eumkConceptIds.Contains(x.ThemaId))
				.Select(x => new PredTestResults
				{
					ThemaId = x.ThemaId,
					ThemaResult = x.ThemaResult,
					ThemaResume = ThemaResume.NEED_TO_LEARN
				})
				.ToList();

			if (availableThemas == null || !availableThemas.Any())
			{
				return new AdaptivityViewResult
				{
					NextThemaId = null,
					NextMaterialPath = null,
					NeedToDoPredTest = true,
					Code = "500"
				};
			}

			adaptivityProcessor.ProcessPredTestResults(availableThemas);

			var subjectId = TestsManagementService.GetTest(testId).SubjectId;
			var staleThemaIds = eumkConceptIds ?? new HashSet<int>(availableThemas.Select(x => x.ThemaId));
			AdaptiveLearningManagementService.ClearEducationData(userId, subjectId, staleThemaIds, adaptivityType);
			AdaptiveLearningManagementService.SaveProcessedPredTestResult(testId, userId, adaptivityType, availableThemas);

			var nextThema = availableThemas.FirstOrDefault(x => x.ThemaResume == ThemaResume.NEED_TO_LEARN);
			if (nextThema == null)
			{
				LockPredTestAfterLearning(subjectId, eumkRootConceptId, userId);
				return new AdaptivityViewResult
				{
					NextThemaId = null,
					NextMaterialPath = null,
					NeedToDoPredTest = false,
					IsLearningEnded = true,
					Code = "200"
				};
			}

			return new AdaptivityViewResult
			{
				NextThemaId = nextThema.ThemaId,
				NextMaterialPath = GetNextThemaPath(nextThema.ThemaId, eumkRootConceptId, out int timeToWait),
				NeedToDoPredTest = false,
				Code = "200"
			};
		}

		public int GetDynamicTestIdForThema(int userId, int subjectId, int complexId, int monitoringRes, int adaptivityType)
		{
			return GetTestForThema(userId, subjectId, complexId, monitoringRes, adaptivityType, 0).TestId;
		}

		public AdaptiveTestViewResult GetTestForThema(int userId, int subjectId, int complexId, int monitoringRes, int adaptivityType, int eumkRootConceptId)
		{
			var sourceTest = GetSourceTestForThema(subjectId, complexId, eumkRootConceptId);

			if (ToAdaptivityType(adaptivityType) == AdaptivityType.SIMPLE)
			{
				return new AdaptiveTestViewResult
				{
					TestId = sourceTest?.Id ?? NO_TEST_ID,
					Title = sourceTest?.Title,
					Code = sourceTest != null ? "200" : "500"
				};
			}

			var adaptivityProcessor = GetLearningProcessor(adaptivityType);
			var allQuestions = QuestionsManagementService
				.GetQuestionsByConceptId(complexId)
				.Where(x => x.Test != null && x.Test.ForEUMK)
				.Where(x => x.Test.Title != AdaptiveConst.AdaptiveTestName)
				.GroupBy(x => x.Title)
				.Select(x => new { x.First().Id, x.First().ComlexityLevel, x.First().Test })
				.ToList();

			if (!allQuestions.Any())
			{
				return new AdaptiveTestViewResult { TestId = NO_TEST_ID, Code = "500" };
			}

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

			var testSettingsSource = sourceTest ?? allQuestions.First().Test;
			var neededQuestionsCount = testSettingsSource.CountOfQuestions > 0
				? testSettingsSource.CountOfQuestions
				: NEEDED_QUSTIONS_COUNT;

			var questionIds = adaptivityProcessor
				.PrepareListOfTestQuestions(prevThemas, allTestQuestions, monitoringRes, 0, neededQuestionsCount)
				.Distinct()
				.ToArray();

			var dynamicTestId = AdaptiveLearningManagementService.CreateDynamicTestForUser(
				subjectId,
				Math.Min(neededQuestionsCount, questionIds.Length),
				testSettingsSource.TimeForCompleting > 0 ? testSettingsSource.TimeForCompleting : DEFAULT_SECONDS_FOR_QUESTION,
				testSettingsSource.TimeForCompleting > 0 && testSettingsSource.SetTimeForAllTest);
			QuestionsManagementService.CopyQuestionsToTest(dynamicTestId, questionIds);

			return new AdaptiveTestViewResult
			{
				TestId = dynamicTestId,
				Title = testSettingsSource.Title,
				Code = "200"
			};
		}

		public int GetPredTestIdForEumk(int subjectId, int eumkRootConceptId)
		{
			return GetPredTestForEumk(subjectId, eumkRootConceptId)?.Id ?? NO_TEST_ID;
		}

		public ResultViewData RestartLearning(int subjectId, int eumkRootConceptId)
		{
			if (!CurrentUserIsLector())
			{
				return new ResultViewData { Message = "Access denied", Code = "403" };
			}

			var eumkConceptIds = GetEumkConceptIds(eumkRootConceptId);
			if (eumkConceptIds == null)
			{
				return new ResultViewData { Message = "EUMK not found", Code = "500" };
			}

			AdaptiveLearningManagementService.ClearEducationData(UserContext.CurrentUserId, subjectId, eumkConceptIds);
			return new ResultViewData { Code = "200" };
		}

		public AdaptivityViewResult GetFirstThema(int userId, int subjectId, int adaptivityType, int eumkRootConceptId)
		{
			var allAvailableThemas = AdaptiveLearningManagementService.GetAllAvaiableThemas(subjectId, adaptivityType, userId);
			allAvailableThemas = FilterThemasByEumk(allAvailableThemas, eumkRootConceptId);
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
			if (first is null && TryRestartLearningByReopenedPredTest(userId, subjectId, eumkRootConceptId))
			{
				return new AdaptivityViewResult
				{
					NextThemaId = null,
					NextMaterialPath = null,
					NeedToDoPredTest = true,
					Code = "200"
				};
			}

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

			return new AdaptivityViewResult
			{
				NextThemaId = first.ThemaId,
				NextMaterialPath = GetNextThemaPath(first.ThemaId, eumkRootConceptId, out int timeToWait),
				ShouldWaitBeforeTest = (ThemaSolutions)first.ThemaResume == ThemaSolutions.REPEAT_CURRENT,
				TimeToWait = timeToWait,
				NeedToDoPredTest = false,
				Code = "200"
			};
		}

		private TestsDifficulties GetTestDifficultyByComplexityLevel(int complexityLevel)
		{
			var difficulties = Enum.GetValues(typeof(TestsDifficulties)).Cast<TestsDifficulties>().ToList();
			var index = Math.Max(0, Math.Min(complexityLevel / 2, difficulties.Count - 1));
			return difficulties[index];
		}

		private List<LMPlatform.Models.KnowledgeTesting.Test> GetEumkTests(int subjectId, int eumkRootConceptId,
			Func<LMPlatform.Models.KnowledgeTesting.Test, bool> testTypeFilter)
		{
			var tests = AdaptiveLearningManagementService
				.GetSubjectTestsWithQuestions(subjectId)
				.Where(x => x.Title != AdaptiveConst.AdaptiveTestName)
				.Where(testTypeFilter)
				.ToList();

			if (eumkRootConceptId <= 0)
			{
				return tests;
			}

			var eumkConceptIds = GetEumkConceptIds(eumkRootConceptId);
			var boundTests = tests.Where(x => x.EumkRootConceptId == eumkRootConceptId);
			var legacyTests = tests.Where(x => !x.EumkRootConceptId.HasValue
				&& eumkConceptIds != null
				&& x.Questions != null
				&& x.Questions.Any(q => q.ConceptId.HasValue && eumkConceptIds.Contains(q.ConceptId.Value)));

			return boundTests.Concat(legacyTests).ToList();
		}

		private LMPlatform.Models.KnowledgeTesting.Test GetPredTestForEumk(int subjectId, int eumkRootConceptId)
		{
			return GetEumkTests(subjectId, eumkRootConceptId, x => x.BeforeEUMK).FirstOrDefault();
		}

		private LMPlatform.Models.KnowledgeTesting.Test GetSourceTestForThema(int subjectId, int themaId, int eumkRootConceptId)
		{
			var candidates = GetEumkTests(subjectId, eumkRootConceptId, x => x.ForEUMK)
				.Where(x => x.Questions != null && x.Questions.Any(q => q.ConceptId == themaId))
				.ToList();

			return candidates.FirstOrDefault(x => x.Questions.All(q => q.ConceptId == themaId))
				?? candidates.FirstOrDefault();
		}

		private bool TryRestartLearningByReopenedPredTest(int userId, int subjectId, int eumkRootConceptId)
		{
			if (CurrentUserIsLector())
			{
				return false;
			}

			var predTest = GetPredTestForEumk(subjectId, eumkRootConceptId);
			if (predTest == null || !AdaptiveLearningManagementService.IsTestUnlockedForStudent(predTest.Id, userId))
			{
				return false;
			}

			var eumkConceptIds = GetEumkConceptIds(eumkRootConceptId);
			if (eumkConceptIds == null)
			{
				return false;
			}

			AdaptiveLearningManagementService.ClearEducationData(userId, subjectId, eumkConceptIds);
			return true;
		}

		private void LockPredTestAfterLearning(int subjectId, int eumkRootConceptId, int userId)
		{
			if (CurrentUserIsLector())
			{
				return;
			}

			try
			{
				var predTest = GetPredTestForEumk(subjectId, eumkRootConceptId);
				if (predTest != null)
				{
					TestsManagementService.UnlockTestForStudent(predTest.Id, userId, false);
				}
			}
			catch
			{
			}
		}
		
		private AdaptiveLearningProcessor GetLearningProcessor(int adaptiivtyType)
		{
			return new AdaptiveLearningProcessor(ToAdaptivityType(adaptiivtyType));
		}

		private static AdaptivityType ToAdaptivityType(int adaptivityType)
		{
			return (AdaptivityType)Enum.GetValues(typeof(AdaptivityType)).GetValue(adaptivityType - 1);
		}

		private bool CurrentUserIsLector()
		{
			return string.Equals(UserContext.Role, Constants.Roles.Lector, StringComparison.OrdinalIgnoreCase);
		}

		private HashSet<int> GetEumkConceptIds(int eumkRootConceptId)
		{
			if (eumkRootConceptId <= 0)
			{
				return null;
			}

			try
			{
				var root = ConceptManagementService.GetLiteById(eumkRootConceptId);
				if (root == null)
				{
					return null;
				}

				var childIdsByParent = ConceptManagementService
					.GetElementsBySubjectId(root.SubjectId)
					.Where(x => x.ParentId.HasValue)
					.ToLookup(x => x.ParentId.Value, x => x.Id);

				var ids = new HashSet<int> { root.Id };
				var pending = new Stack<int>();
				pending.Push(root.Id);
				while (pending.Count > 0)
				{
					foreach (var childId in childIdsByParent[pending.Pop()])
					{
						if (ids.Add(childId))
						{
							pending.Push(childId);
						}
					}
				}

				return ids;
			}
			catch
			{
				return null;
			}
		}

		private IEnumerable<ConceptThema> FilterThemasByEumk(IEnumerable<ConceptThema> themas, int eumkRootConceptId)
		{
			if (themas == null)
			{
				return themas;
			}

			var eumkConceptIds = GetEumkConceptIds(eumkRootConceptId);
			if (eumkConceptIds == null)
			{
				return themas;
			}

			return themas.Where(x => eumkConceptIds.Contains(x.ThemaId)).ToList();
		}

		private ConceptViewData FindConceptViewById(ConceptViewData root, int conceptId)
		{
			if (root == null)
			{
				return null;
			}

			if (root.Id == conceptId)
			{
				return root;
			}

			if (root.Children == null)
			{
				return null;
			}

			foreach (var ch in root.Children)
			{
				var hit = FindConceptViewById(ch, conceptId);
				if (hit != null)
				{
					return hit;
				}
			}

			return null;
		}

		private void CollectTheoryPathsUnderThema(ConceptViewData node, List<string> paths, ref int totalSeconds)
		{
			if (node == null)
			{
				return;
			}

			if (node.TestId.HasValue)
			{
				return;
			}

			if (node.IsGroup)
			{
				if (node.Children == null || !node.Children.Any())
				{
					return;
				}

				foreach (var child in node.Children)
				{
					CollectTheoryPathsUnderThema(child, paths, ref totalSeconds);
				}

				return;
			}

			if (!node.HasData)
			{
				return;
			}

			var attachments = (node.Attachments != null && node.Attachments.Count > 0)
				? node.Attachments
				: FilesManagementService.GetAttachments(node.Container);
			var nodePaths = EumkMaterialPaths.GetViewablePaths(attachments);
			if (!nodePaths.Any())
			{
				return;
			}

			paths.AddRange(nodePaths);
			totalSeconds += WatchingTimeService.GetEstimatedTime(node.Container);
		}

		private List<string> GetNextThemaPath(int themaId, int eumkRootConceptId, out int generalTime)
		{
			if (eumkRootConceptId <= 0)
			{
				return GetNextThemaPathLegacy(themaId, out generalTime);
			}

			try
			{
				var rootConcept = ConceptManagementService.GetTreeConceptByElementId(eumkRootConceptId);
				var viewRoot = new ConceptViewData(rootConcept, true, FilesManagementService, true, CurrentUserIsLector());
				var themaView = FindConceptViewById(viewRoot, themaId);
				if (themaView == null)
				{
					return GetNextThemaPathLegacy(themaId, out generalTime);
				}

				var paths = new List<string>();
				var seconds = 0;
				CollectTheoryPathsUnderThema(themaView, paths, ref seconds);
				paths = paths.Where(p => !string.IsNullOrWhiteSpace(p)).ToList();
				if (!paths.Any())
				{
					return GetNextThemaPathLegacy(themaId, out generalTime);
				}

				generalTime = seconds;
				return paths;
			}
			catch
			{
				return GetNextThemaPathLegacy(themaId, out generalTime);
			}
		}

		private List<string> GetNextThemaPathLegacy(int themaId, out int generalTime)
		{
			var concept = ConceptManagementService.GetLiteById(themaId);

			if (concept.IsGroup)
			{
				var tree = ConceptManagementService.GetElementsByParentId(themaId);
				generalTime = tree.Sum(x => WatchingTimeService.GetEstimatedTime(x.Container));
				return  tree.SelectMany(x => GetFilePaths(x.Container)).ToList();
			}
			generalTime = WatchingTimeService.GetEstimatedTime(concept.Container);
			return GetFilePaths(concept.Container);
		}

		private List<string> GetFilePaths(string container)
		{
			if (string.IsNullOrEmpty(container))
			{
				return new List<string>();
			}

			return EumkMaterialPaths.GetViewablePaths(FilesManagementService.GetAttachments(container));
		}

	}
}
