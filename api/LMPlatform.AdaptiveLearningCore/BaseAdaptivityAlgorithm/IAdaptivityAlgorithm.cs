using LMPlatform.AdaptiveLearningCore.Models;
using LMPlatform.AdaptiveLearningCore.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMPlatform.AdaptiveLearningCore.BaseAdaptivityAlgorithm
{
	interface IAdaptivityAlgorithm
	{
		ThemaResult GetResultByCurrentThema(int currentThemaId, int currentThemaTestResult, IEnumerable<ConceptThema> allAvailableThemes);

		void MarkAllAvailableThemas (IEnumerable<PredTestResults> predestResults);

		List<int> PrepareTestQuestionsByDifficulty(IEnumerable<ThemaResult> prevThemaResult, IEnumerable<TestQuestion> testQuestions,
			int monitoringByStudent, int monitoringByDefault, int neededQuestionCount);
	}
}
