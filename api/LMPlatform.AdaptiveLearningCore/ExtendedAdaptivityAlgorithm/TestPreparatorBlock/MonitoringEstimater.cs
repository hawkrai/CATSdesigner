using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMPlatform.AdaptiveLearningCore.ExtendedAdaptivityAlgorithm.TestPreparatorBlock
{
	internal class MonitoringEstimater
	{
		private const double OPTIMUM = 0.7;
		internal static MonitoringResult EstimateMonitoringTimes(int currentMonitoring, int monitoringByDefault)
		{

			var ratio = (double)monitoringByDefault / (currentMonitoring + monitoringByDefault);

			return FuzzySetSolver.GetResultByOptimum<MonitoringResult>(OPTIMUM, ratio);

			//var ratio = (double)monitoringByDefault / currentMonitoring;

			//return ratio < 0.5 ? MonitoringResult.MATCH_SLOWER : 
			//		 ratio < 1 ? MonitoringResult.SLOWER :
			//			ratio == 1 ? MonitoringResult.EQUAL : 
			//				ratio < 2 ? MonitoringResult.FASTER : MonitoringResult.MATCH_FASTER;

		}
	}

	internal enum MonitoringResult 
	{
		MATCH_FASTER,
		FASTER,
		EQUAL,
		SLOWER,
		MATCH_SLOWER
	}
}
