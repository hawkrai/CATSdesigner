using LMPlatform.AdaptiveLearningCore.Models;
using LMPlatform.AdaptiveLearningCore.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMPlatform.AdaptiveLearningCore.ExtendedAdaptivityAlgorithm.TestPreparatorBlock
{
	internal class TestDificultyPreparator
	{
		internal static TestsDifficulties GetTestDifficulty(IEnumerable<ThemaResult> prevThemaResult, int monitoringByStudent, int monitoringByDefault)
		{
			var monitoringEstimation = MonitoringEstimater.EstimateMonitoringTimes(monitoringByStudent, monitoringByDefault);
			var performanceEstimation = PerformanceEstimater.EstimatePreviousPerformance(prevThemaResult);

			bool isHigh = ((performanceEstimation == PerformanceResults.ADVANCED
								&& new[] { MonitoringResult.MATCH_FASTER, MonitoringResult.FASTER }.Contains(monitoringEstimation)) ||
							(performanceEstimation == PerformanceResults.HIGH && monitoringEstimation == MonitoringResult.MATCH_FASTER));

			bool isAdvanced = ((performanceEstimation == PerformanceResults.ADVANCED
									&& new[] { MonitoringResult.EQUAL, MonitoringResult.SLOWER }.Contains(monitoringEstimation)) ||
								(performanceEstimation == PerformanceResults.HIGH
									&& new[] { MonitoringResult.FASTER, MonitoringResult.EQUAL}.Contains(monitoringEstimation)) ||
								(performanceEstimation == PerformanceResults.MEDIUM && monitoringEstimation == MonitoringResult.MATCH_FASTER));

			bool isMedium = ((performanceEstimation == PerformanceResults.ADVANCED && monitoringEstimation == MonitoringResult.MATCH_SLOWER) ||
							(performanceEstimation == PerformanceResults.HIGH
								&& new[] { MonitoringResult.SLOWER, MonitoringResult.MATCH_SLOWER }.Contains(monitoringEstimation)) ||
							(performanceEstimation == PerformanceResults.MEDIUM
								&& new[] { MonitoringResult.FASTER, MonitoringResult.EQUAL }.Contains(monitoringEstimation)) ||
							(performanceEstimation == PerformanceResults.REDUCED && monitoringEstimation == MonitoringResult.MATCH_FASTER));

			bool isReduced = ((performanceEstimation == PerformanceResults.MEDIUM
									&& new[] { MonitoringResult.SLOWER, MonitoringResult.MATCH_SLOWER }.Contains(monitoringEstimation)) ||
								(performanceEstimation == PerformanceResults.REDUCED
									&& new[] { MonitoringResult.FASTER, MonitoringResult.EQUAL }.Contains(monitoringEstimation)) ||
								(performanceEstimation == PerformanceResults.LOW
									&& new[] { MonitoringResult.MATCH_FASTER, MonitoringResult.FASTER }.Contains(monitoringEstimation)));

			return isHigh ? TestsDifficulties.HIGH :
					isAdvanced ? TestsDifficulties.ADVANCED :
						isMedium ? TestsDifficulties.MEDIUM :
							isReduced ? TestsDifficulties.REDUCED : TestsDifficulties.LOW;
		}
	}

	
}
