using LMPlatform.AdaptiveLearningCore.Models;
using LMPlatform.Models.AdaptivityLearning;
using System.Collections.Generic;
using System.Linq;

namespace LMPlatform.AdaptiveLearningCore.ExtendedAdaptivityAlgorithm.CurrentPerformance
{
	internal class RemainingMaterialChecker
	{
		private const double OPTIMUM = 0.8;

		internal static RemainigMaterialResult EvalueteRemainigMaterial(IEnumerable<ConceptThema> allThemasInCurrentConcept)
		{
			var allThemasCount = (double)allThemasInCurrentConcept.Count();
			var learnedThemasCount = allThemasInCurrentConcept.Count(x => x.ThemaResume == ThemaResume.LEARNED);

			var themasCountRatio = learnedThemasCount / allThemasCount;

			return FuzzySetSolver.GetResultByOptimum<RemainigMaterialResult>(OPTIMUM, themasCountRatio);
		}
	}

	internal enum RemainigMaterialResult {
		NOT_LEARNED,
		MOSTLY_NOT_LEARNED,
		HALF_LEARNED,
		MOSTLY_LEARNED,
		LEARNED
	}
}
