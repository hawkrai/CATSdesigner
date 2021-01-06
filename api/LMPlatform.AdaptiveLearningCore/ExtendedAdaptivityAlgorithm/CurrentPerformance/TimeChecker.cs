using System;

namespace LMPlatform.AdaptiveLearningCore.ExtendedAdaptivityAlgorithm.CurrentPerformance
{
	internal class TimeChecker
	{
		private const double OPTIMUM = 0.85;
		private const double DAYS_IN_SEMESTR = 112;

		internal static TimeResult EvalueteTime()
		{
			var currentDate = DateTime.Today;

			var currentYear = currentDate.Year;
			var fallSemestr = new DateTime(currentYear, 12, 26);
			var springSemestr = new DateTime(currentYear, 6, 14);

			var timeToCompare = currentDate > springSemestr ? fallSemestr : springSemestr;

			var timeRatio = (timeToCompare - currentDate).Days / DAYS_IN_SEMESTR;

			return FuzzySetSolver.GetResultByOptimum<TimeResult>(OPTIMUM, timeRatio);

			//var timeRatio = DAYS_IN_SEMESTR / (timeToCompare - currentDate).Days;

			//return timeRatio > 5 ? TimeResult.NO_TIME : 
			//		timeRatio > 3 ? TimeResult.LESS_THAN_HALF_TIME : 
			//			timeRatio > 2 ? TimeResult.HALF_TIME : 
							//timeRatio > 1.5 ? TimeResult.MORE_THAN_HALF_TIME : TimeResult.START_LEARNING;
		}		
	}

	internal enum TimeResult {
		START_LEARNING,
		MORE_THAN_HALF_TIME,
		HALF_TIME,
		LESS_THAN_HALF_TIME,
		NO_TIME
	}
}
