using LMPlatform.AdaptiveLearningCore.BaseAdaptivityAlgorithm;
using LMPlatform.AdaptiveLearningCore.ExtendedAdaptivityAlgorithm.CheckForRepeat;
using LMPlatform.AdaptiveLearningCore.ExtendedAdaptivityAlgorithm.CurrentPerformance;
using LMPlatform.AdaptiveLearningCore.ExtendedAdaptivityAlgorithm.CurrentThemaResult;
using LMPlatform.AdaptiveLearningCore.ExtendedAdaptivityAlgorithm.GetSolutionBlock;
using LMPlatform.AdaptiveLearningCore.ExtendedAdaptivityAlgorithm.TestPreparatorBlock;
using LMPlatform.AdaptiveLearningCore.Models;
using LMPlatform.AdaptiveLearningCore.Shared;
using LMPlatform.Models.AdaptivityLearning;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMPlatform.AdaptiveLearningCore.ExtendedAdaptivityAlgorithm
{
	public class ExtendedAdaptivity : IAdaptivityAlgorithm
	{
		public ThemaResult GetResultByCurrentThema(int currentThemaId, int currentThemaTestResult, IEnumerable<ConceptThema> allAvailableThemes)
		{
			var currentPerformance = CurrentPerformanceChecker.CheckCurrentPerformance(allAvailableThemes);
			var currentResult = ResultChechker.EvalueteCurrentThemaResult(currentThemaTestResult);
			var themasForRepeat = ThemasForRepeatCollector.PrepareThemasToRepeat(allAvailableThemes);

			var themaSolution = ThemaSolutionLinker.GetThemaSolution(currentPerformance, currentResult, themasForRepeat);

			var nextThemaId = themaSolution == ThemaSolutions.REPEAT_CURRENT ? currentThemaId :
				themaSolution == ThemaSolutions.GET_NEXT ? allAvailableThemes.FirstOrDefault(x => x.ThemaResume == ThemaResume.NEED_TO_LEARN && x.ThemaId != currentThemaId)?.ThemaId :
				themaSolution == ThemaSolutions.REPEAT_PREV ? GetThemaForRepeat(themasForRepeat, currentPerformance) : default(int?);
			
			return new ThemaResult() 
			{
				ThemaId = currentThemaId,
				ResultByCurrentThema = currentResult,
				NextStepSolution = nextThemaId is null ? ThemaSolutions.END_PROCCESS : themaSolution,
				NextThemaId = nextThemaId
			};
		}
		  
		public void MarkAllAvailableThemas(IEnumerable<PredTestResults> predtestResults)
		{
			var currentPerformance = PerformanceResult.NORMAL_PERFORMANCE;
			var themasForRepeat = new List<ThemasForRepeat>();

			foreach (var testRes in predtestResults)
			{
				var currentResult = ResultChechker.EvalueteCurrentThemaResult(testRes.ThemaResult);
				var themaSolution = ThemaSolutionLinker.GetThemaSolution(currentPerformance, currentResult, 
					themasForRepeat);

				testRes.ThemaResume = themaSolution == ThemaSolutions.GET_NEXT ? 
					ThemaResume.LEARNED : ThemaResume.NEED_TO_LEARN;
			}
		}

		public List<int> PrepareTestQuestionsByDifficulty(IEnumerable<ThemaResult> prevThemaResult, IEnumerable<TestQuestion> testQuestions, 
			int monitoringByStudent, int monitoringByDefault, int neededQuestionCount)
		{
			var difficulty = TestDificultyPreparator.GetTestDifficulty(prevThemaResult, monitoringByStudent, monitoringByDefault);
			return TestQuestionPreparator.GetTestQuestionByDifficulty(testQuestions, difficulty, neededQuestionCount)
				.Select(x => x.TestQuestionId)
				.ToList();
		}

		private int GetThemaForRepeat(List<ThemasForRepeat> forRepeat, PerformanceResult performance)
		{
			var needToRepeat = forRepeat.FirstOrDefault(x => x.RepeatResult == RepeatResult.NEED_TO_REPEATE)?.ThemaId;
			
			if (needToRepeat == null && performance == PerformanceResult.ADVANCED_PERFORMANCE) 
			{
				return forRepeat.First(x => x.RepeatResult == RepeatResult.CAN_BE_REPEATED).ThemaId;
			}

			return needToRepeat.Value;


		}
	}
}
