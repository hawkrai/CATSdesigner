using LMPlatform.AdaptiveLearningCore.Models;
using LMPlatform.AdaptiveLearningCore.Shared;
using LMPlatform.Models.AdaptivityLearning;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMPlatform.AdaptiveLearningCore.ExtendedAdaptivityAlgorithm.CheckForRepeat
{
	internal class ThemasForRepeatCollector
	{
		internal static List<ThemasForRepeat> PrepareThemasToRepeat(IEnumerable<ConceptThema> allAvailableThemas)
		{
			return allAvailableThemas
				.Where(x => x.ThemaResume == ThemaResume.LEARNED)
				.Select(x => new ThemasForRepeat() 
					{
						ThemaId = x.ThemaId,
						RepeatResult = CheckForNeedToRepeat(x.DateOfPass.Value, x.FinalThemaResult.Value)
					})
				.ToList();

		}

		private static RepeatResult CheckForNeedToRepeat(DateTime passDate, ThemaResults themaResult)
		{
			var repeatDate = TimeForRepeatChecker.EvalueteTimeForRepeat(passDate);

			bool themaNotNeedToBeRepeated = ((repeatDate == TimeForRepeatResult.JUST_NOW) ||
												repeatDate == TimeForRepeatResult.RECENTLY && new[] { ThemaResults.WELL_LEARNED, ThemaResults.FULL_LEARNED }.Contains(themaResult) ||
													repeatDate == TimeForRepeatResult.NOT_VERY_LONG_AGO && themaResult == ThemaResults.FULL_LEARNED);

			bool themaNeedToBeRepeated = ((repeatDate == TimeForRepeatResult.NOT_VERY_LONG_AGO && themaResult == ThemaResults.MEDIUM_LEARNED) || 
											repeatDate == TimeForRepeatResult.LONG_AGO && new[] { ThemaResults.WELL_LEARNED, ThemaResults.MEDIUM_LEARNED }.Contains(themaResult));

			return themaNeedToBeRepeated ? RepeatResult.NEED_TO_REPEATE :
					themaNotNeedToBeRepeated ? RepeatResult.NOT_NEED_TO_REPEAT : 
						RepeatResult.CAN_BE_REPEATED;
		}
	}
}
