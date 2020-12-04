using LMPlatform.AdaptiveLearningCore.Models;
using LMPlatform.AdaptiveLearningCore.Shared;
using LMPlatform.Models.AdaptivityLearning;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMPlatform.AdaptiveLearningCore.ExtendedAdaptivityAlgorithm.TestPreparatorBlock
{
	internal class PerformanceEstimater
	{
		private const double NOT_BAD_OPTIMUM = 0.1;
		private const double GOOD_OPTIMUM = 0.8;
		private const double EXCELLENT_OPTIMUM = 0.5;
		
		internal static PerformanceResults EstimatePreviousPerformance(IEnumerable<ThemaResult> prevThemaResult)
		{
			var generalCount = (double)prevThemaResult.Count();

			var notBadRatio = prevThemaResult.Count(x => x.ResultByCurrentThema == ThemaResults.MEDIUM_LEARNED) / generalCount;
			var goodRatio = prevThemaResult.Count(x => x.ResultByCurrentThema == ThemaResults.WELL_LEARNED) / generalCount;
			var excellentRatio = prevThemaResult.Count(x => x.ResultByCurrentThema == ThemaResults.FULL_LEARNED) / generalCount;

			return FuzzySetSolver.GetResultForSetOfParameters<PerformanceResults>((NOT_BAD_OPTIMUM, notBadRatio, true),
				(GOOD_OPTIMUM, goodRatio, false), (EXCELLENT_OPTIMUM, excellentRatio, false));
		}
	}

	internal enum PerformanceResults 
	{
		LOW,
		REDUCED,
		MEDIUM,
		ADVANCED,
		HIGH
	}
}
