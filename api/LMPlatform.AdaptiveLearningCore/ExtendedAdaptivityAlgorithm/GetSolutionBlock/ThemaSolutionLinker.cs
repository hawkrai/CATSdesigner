using LMPlatform.AdaptiveLearningCore.ExtendedAdaptivityAlgorithm.CheckForRepeat;
using LMPlatform.AdaptiveLearningCore.ExtendedAdaptivityAlgorithm.CurrentPerformance;
using LMPlatform.AdaptiveLearningCore.Models;
using LMPlatform.AdaptiveLearningCore.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMPlatform.AdaptiveLearningCore.ExtendedAdaptivityAlgorithm.GetSolutionBlock
{
	internal class ThemaSolutionLinker
	{
		internal static ThemaSolutions GetThemaSolution(PerformanceResult performanceRes,
			ThemaResults themaResult, List<ThemasForRepeat> forRepeat)
		{
			bool shouldRepeatCurrent = new[] { ThemaResults.BAD_LEARNED, ThemaResults.NOT_LEARNED }.Contains(themaResult) ||
				(themaResult == ThemaResults.MEDIUM_LEARNED
					&& new[] { PerformanceResult.ADVANCED_PERFORMANCE, PerformanceResult.NORMAL_PERFORMANCE }.Contains(performanceRes)) ||
				(themaResult == ThemaResults.WELL_LEARNED && performanceRes == PerformanceResult.ADVANCED_PERFORMANCE);

			bool shouldGoToNext = ((new[] { ThemaResults.MEDIUM_LEARNED, ThemaResults.WELL_LEARNED, ThemaResults.FULL_LEARNED }.Contains(themaResult)
										&& performanceRes == PerformanceResult.REDUCED_PERFORMANCE) ||
									(new[] { ThemaResults.WELL_LEARNED, ThemaResults.FULL_LEARNED }.Contains(themaResult)
										&& performanceRes == PerformanceResult.NORMAL_PERFORMANCE
										&& !forRepeat.Any(x => x.RepeatResult == RepeatResult.NEED_TO_REPEATE)) ||
									(themaResult == ThemaResults.FULL_LEARNED && performanceRes == PerformanceResult.ADVANCED_PERFORMANCE
										&& !forRepeat.Any(x => x.RepeatResult != RepeatResult.NOT_NEED_TO_REPEAT)));

			bool shouldRepeatPrev = ((new[] { ThemaResults.WELL_LEARNED, ThemaResults.FULL_LEARNED }.Contains(themaResult)
										&& performanceRes == PerformanceResult.NORMAL_PERFORMANCE
										&& forRepeat.Any(x => x.RepeatResult == RepeatResult.NEED_TO_REPEATE)) ||
									(themaResult == ThemaResults.FULL_LEARNED && performanceRes == PerformanceResult.ADVANCED_PERFORMANCE
										&& forRepeat.Any(x => x.RepeatResult != RepeatResult.NOT_NEED_TO_REPEAT)));

			return shouldRepeatCurrent ? ThemaSolutions.REPEAT_CURRENT : 
					shouldGoToNext ? ThemaSolutions.GET_NEXT : 
						shouldRepeatPrev ? ThemaSolutions.REPEAT_PREV : ThemaSolutions.END_PROCCESS;
		}
	}
}
