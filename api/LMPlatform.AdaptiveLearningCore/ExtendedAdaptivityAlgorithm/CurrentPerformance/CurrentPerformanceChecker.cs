using LMPlatform.AdaptiveLearningCore.Models;
using System.Collections.Generic;
using System.Linq;

namespace LMPlatform.AdaptiveLearningCore.ExtendedAdaptivityAlgorithm.CurrentPerformance
{
	internal class CurrentPerformanceChecker
	{
		internal static PerformanceResult CheckCurrentPerformance(IEnumerable<ConceptThema> allAvailableThemas)
		{
			var remainingTime = TimeChecker.EvalueteTime();
			var remainingMaterial = RemainingMaterialChecker.EvalueteRemainigMaterial(allAvailableThemas);

			bool isNormal = ((remainingTime == TimeResult.START_LEARNING && remainingMaterial == RemainigMaterialResult.NOT_LEARNED) ||
					(remainingTime == TimeResult.MORE_THAN_HALF_TIME && remainingMaterial == RemainigMaterialResult.MOSTLY_NOT_LEARNED) ||
					(remainingTime == TimeResult.HALF_TIME && remainingMaterial == RemainigMaterialResult.HALF_LEARNED) ||
					(remainingTime == TimeResult.LESS_THAN_HALF_TIME && remainingMaterial == RemainigMaterialResult.MOSTLY_LEARNED) ||
					(remainingTime == TimeResult.NO_TIME && remainingMaterial == RemainigMaterialResult.LEARNED));			

			bool isAdvanced = ((remainingTime == TimeResult.LESS_THAN_HALF_TIME && remainingMaterial == RemainigMaterialResult.LEARNED) ||
					(remainingTime == TimeResult.HALF_TIME
							&& new[] { RemainigMaterialResult.LEARNED, RemainigMaterialResult.MOSTLY_LEARNED }.Contains(remainingMaterial)) ||
					(remainingTime == TimeResult.MORE_THAN_HALF_TIME
							&& new[] { RemainigMaterialResult.LEARNED, RemainigMaterialResult.MOSTLY_LEARNED, RemainigMaterialResult.HALF_LEARNED }.Contains(remainingMaterial)) ||
					(remainingTime == TimeResult.START_LEARNING
							&& new[] { RemainigMaterialResult.LEARNED, RemainigMaterialResult.MOSTLY_LEARNED, RemainigMaterialResult.HALF_LEARNED, RemainigMaterialResult.MOSTLY_NOT_LEARNED }.Contains(remainingMaterial)));

			return isNormal ? PerformanceResult.NORMAL_PERFORMANCE : 
						isAdvanced ? PerformanceResult.ADVANCED_PERFORMANCE : PerformanceResult.REDUCED_PERFORMANCE;

		}
	}

	internal enum PerformanceResult {
		REDUCED_PERFORMANCE,
		NORMAL_PERFORMANCE,
		ADVANCED_PERFORMANCE
	}
}
