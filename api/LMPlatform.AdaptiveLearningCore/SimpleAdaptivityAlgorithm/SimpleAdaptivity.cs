using LMPlatform.AdaptiveLearningCore.BaseAdaptivityAlgorithm;
using LMPlatform.AdaptiveLearningCore.Models;
using LMPlatform.AdaptiveLearningCore.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMPlatform.AdaptiveLearningCore.SimpleAdaptivityAlgorithm
{
	public class SimpleAdaptivity : IAdaptivityAlgorithm
	{
		private static readonly TestResultSimpleProcessor testProcessor = new TestResultSimpleProcessor();
		
		public ThemaResult GetResultByCurrentThema(int currentThemaId, int currentThemaTestResult, IEnumerable<ConceptThema> allAvailableThemes)
		{
			var res = testProcessor.GetTestResult(currentThemaTestResult);
			var solution = res == ThemaResults.NOT_LEARNED ? ThemaSolutions.REPEAT_CURRENT : ThemaSolutions.GET_NEXT;
			var nextStep = solution == ThemaSolutions.REPEAT_CURRENT ? currentThemaId 
				: allAvailableThemes.FirstOrDefault(x => x.ThemaResume == ThemaResume.NEED_TO_LEARN).ThemaId;

			return new ThemaResult
			{
				ThemaId = currentThemaId,
				ResultByCurrentThema = res,
				NextStepSolution = solution,
				NextThemaId = nextStep
			};
		}		

		public void MarkAllAvailableThemas(IEnumerable<PredTestResults> predestResults)
		{
			foreach (var predTestResult in predestResults)
			{
				var testRes = testProcessor.GetTestResult(predTestResult.ThemaResult);
				predTestResult.ThemaResume = testRes == ThemaResults.BAD_LEARNED ? ThemaResume.NEED_TO_LEARN : ThemaResume.LEARNED;
			}
		}
		

		public List<int> PrepareTestQuestionsByDifficulty(IEnumerable<ThemaResult> prevThemaResult, IEnumerable<TestQuestion> testQuestions, 
			int monitoringByStudent, int monitoringByDefault, int neededQuestionCount)
		{
			return testQuestions.Take(neededQuestionCount).Select(x => x.TestQuestionId).ToList();
		}
	}
}
