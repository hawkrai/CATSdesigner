using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMPlatform.AdaptiveLearningCore.ExtendedAdaptivityAlgorithm
{
	public class FuzzySetSolver
	{
		struct WieghtFunctionElement
		{
			public WieghtFunctionElement(double val, double weight)
			{
				Value = Math.Round(val, 2);
				Weight = ZeroIfSubZero(weight);
			}
			public double Value { get; set; }
			public double Weight { get; set; }
		}

		private static double ZeroIfSubZero(double val)
		{
			return val > 0 ? Math.Round(val, 2) : 0;
		}

		private static WieghtFunctionElement GetNextWeight(double optimum, double currentVal, double lastWeight)
		{
			var stepDif = Math.Abs(optimum - currentVal) / 2;
			return new WieghtFunctionElement(currentVal, lastWeight - stepDif);
		}
		private static List<WieghtFunctionElement> GetWeightForOptimal(double optimum)
		{
			var resList = new List<WieghtFunctionElement>();

			resList.Add(new WieghtFunctionElement(optimum, 1));

			for (var i = optimum + 0.05; i < 1; i += 0.05)
			{
				resList.Add(GetNextWeight(optimum, i, resList.Last().Weight));
			}
			resList.Add(GetNextWeight(optimum, 1, resList.Last().Weight));

			resList.Reverse();

			for (var i = optimum - 0.05; i > 0; i -= 0.05)
			{
				resList.Add(GetNextWeight(optimum, i, resList.Last().Weight));
			}
			resList.Add(GetNextWeight(optimum, 0, resList.Last().Weight));

			return resList;

		}

		private static IEnumerable<WieghtFunctionElement> CalculateMedium(IEnumerable<WieghtFunctionElement> good, IEnumerable<WieghtFunctionElement> worse)
		{
			var notGood = good.Select(x => new WieghtFunctionElement(x.Value, 1 - Math.Pow(x.Weight, 2)));
			var notBad = worse.Select(x => new WieghtFunctionElement(x.Value, 1 - Math.Pow(x.Weight, 2)));

			for (int i = 0; i < notGood.Count(); ++i)
			{
				(var notBadVal, var notGoodVal) = (notBad.ElementAt(i), notGood.ElementAt(i));
				yield return notBadVal.Value < notGoodVal.Value ? notBadVal : notGoodVal;
			}
		}
		private static Dictionary<T, List<WieghtFunctionElement>> CalculateWeights<T>(T[] enumVals, double optimum, bool isReversiveEstimation)
		{
			var resDict = new Dictionary<T, List<WieghtFunctionElement>>();

			var good = GetWeightForOptimal(optimum);
			resDict.Add(enumVals[3], good);

			var theBest = GetWeightForOptimal(isReversiveEstimation ? 0 : 1);
			resDict.Add(enumVals[4], theBest.ToList());

			var worse = good.Select(x => new WieghtFunctionElement(x.Value, 1 - x.Weight));
			resDict.Add(enumVals[1], worse.ToList());

			var theWorst = worse.Select(x => new WieghtFunctionElement(x.Value, Math.Pow(x.Weight, 2)));
			resDict.Add(enumVals[0], theWorst.ToList());

			var medium = CalculateMedium(good, worse);
			resDict.Add(enumVals[2], medium.ToList());

			return resDict;
		}
		private static void PrepareCheckedValue<T>(ref double checkedValue, Dictionary<T, List<WieghtFunctionElement>> weights)
		{
			while (true)
			{
				var rounded = Math.Round(checkedValue, 2);
				if (weights.Any(x => x.Value.Any(y => y.Value == rounded)))
				{
					return;
				}
				checkedValue += 0.01;
			}
		}
		public static T GetResultByOptimum<T>(double optimal, double checkedValue, bool isReversiveEstimation = false)
		{
			var enumVals = Enum.GetValues(typeof(T)).Cast<T>().ToArray();
			var weights = CalculateWeights(enumVals, optimal, isReversiveEstimation);

			PrepareCheckedValue<T>(ref checkedValue, weights);

			var resDict = weights
				.Select(x => new 
				{ x.Key, 
					Value = x.Value
					.First(y => y.Value == Math.Round(checkedValue)).Weight 
				}).ToDictionary(x => x.Key, x => x.Value);

			return resDict.First(x => x.Value == resDict.Values.Max()).Key;			
		}

		public static T GetResultForSetOfParameters<T>(params (double optimal, double checkedValue, bool isReversiveEstimation)[] args)
		{
			var enumVals = Enum.GetValues(typeof(T)).Cast<T>().ToArray();
			var resDict = new Dictionary<T, double>();

			foreach (var arg in args)
			{
				var weights = CalculateWeights(enumVals, arg.optimal, arg.isReversiveEstimation);
				var checkedValue = arg.checkedValue;
				PrepareCheckedValue<T>(ref checkedValue, weights);

				var loopResDict = weights
					.Select(x => new
					{
						x.Key,
						Value = x.Value
						.First(y => y.Value == Math.Round(arg.checkedValue)).Weight
					}).ToDictionary(x => x.Key, x => x.Value);

				var loopRes = loopResDict.First(x => x.Value == loopResDict.Values.Max());
				resDict.Add(loopRes.Key, loopRes.Value);
			}
			
			return resDict.First(x => x.Value == resDict.Values.Max()).Key;
		}
	}
}
