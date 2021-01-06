using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMPlatform.AdaptiveLearningCore.ExtendedAdaptivityAlgorithm.CheckForRepeat
{
	internal class ThemasForRepeat
	{
		public int ThemaId { get; set; }
		public RepeatResult RepeatResult { get; set; }
	}

	internal enum RepeatResult {
		NOT_NEED_TO_REPEAT,
		CAN_BE_REPEATED,
		NEED_TO_REPEATE
	}
}
