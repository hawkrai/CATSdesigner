using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMPlatform.AdaptiveLearningCore.ExtendedAdaptivityAlgorithm.CheckForRepeat
{
	internal class TimeForRepeatChecker
	{
		internal static TimeForRepeatResult EvalueteTimeForRepeat(DateTime passTime)
		{
			var currentDate = DateTime.Today;
			var difInDays = (currentDate - passTime).Days;

			return difInDays == 0 ? TimeForRepeatResult.JUST_NOW :
						difInDays < 14 ? TimeForRepeatResult.RECENTLY :
							difInDays < 30 ? TimeForRepeatResult.NOT_VERY_LONG_AGO : TimeForRepeatResult.LONG_AGO;
					
		}
	}

	internal enum TimeForRepeatResult {
		LONG_AGO,
		NOT_VERY_LONG_AGO,
		RECENTLY,
		JUST_NOW
	}
}
