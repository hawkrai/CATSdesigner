using LMPlatform.AdaptiveLearningCore.BaseAdaptivityAlgorithm;
using LMPlatform.AdaptiveLearningCore.ExtendedAdaptivityAlgorithm;
using LMPlatform.AdaptiveLearningCore.Shared;
using LMPlatform.AdaptiveLearningCore.SimpleAdaptivityAlgorithm;
using LMPlatform.Models.AdaptivityLearning;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMPlatform.AdaptiveLearningCore
{
	static class AdaptivityAlgorithmCreator
	{
		public static IAdaptivityAlgorithm GetAlgorithmByType(AdaptivityType type)
		{
			if (type == AdaptivityType.EXTENDED)
			{
				return new ExtendedAdaptivity();
			}

			return new SimpleAdaptivity();
		}
	}
}
