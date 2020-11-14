using LMPlatform.AdaptiveLearningCore.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMPlatform.AdaptiveLearningCore.ExtendedAdaptivityAlgorithm.CurrentThemaResult
{
	internal class ResultChechker
	{
		private const double OPTIMUM = 0.85;
		internal static ThemaResults EvalueteCurrentThemaResult(int currentRes)
		{
			return FuzzySetSolver.GetResultByOptimum<ThemaResults>(OPTIMUM, (double)currentRes / 100);

			//return currentRes == 100 ? ThemaResults.FULL_LEARNED :
			//		 currentRes > 80 ? ThemaResults.WELL_LEARNED :
			//			currentRes > 50 ? ThemaResults.MEDIUM_LEARNED :
			//				currentRes > 30 ? ThemaResults.BAD_LEARNED : ThemaResults.NOT_LEARNED;
		}
	}
}
