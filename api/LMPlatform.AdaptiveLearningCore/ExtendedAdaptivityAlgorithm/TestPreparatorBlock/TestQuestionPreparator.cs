using LMPlatform.AdaptiveLearningCore.Models;
using LMPlatform.AdaptiveLearningCore.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMPlatform.AdaptiveLearningCore.ExtendedAdaptivityAlgorithm.TestPreparatorBlock
{
	internal class TestQuestionPreparator
	{
		static Dictionary<TestsDifficulties, double[]> TestTaskDificultyWeigths = new Dictionary<TestsDifficulties, double[]>()
		{
			{ TestsDifficulties.LOW,      new []{ 0.8, 0.2, 0, 0, 0 } },
			{ TestsDifficulties.REDUCED,  new []{ 0.1, 0.6, 0.2, 0.1, 0 } },
			{ TestsDifficulties.MEDIUM,   new []{ 0.1, 0.2, 0.4, 0.2, 0.1 } },
			{ TestsDifficulties.ADVANCED, new []{ 0, 0.1, 0.2, 0.6, 0.1 } },
			{ TestsDifficulties.HIGH,     new []{ 0, 0, 0.1, 0.2, 0.7 } }
		};

		internal static List<TestQuestion> GetTestQuestionByDifficulty(IEnumerable<TestQuestion> testQuestions, 
			TestsDifficulties difficulty, int neededQuestionsCount)
		{
			var weightList = TestTaskDificultyWeigths[difficulty];
			var questionList = new List<TestQuestion>();
			var neededCoef = neededQuestionsCount;

			for (int i = 0; i < weightList.Length; ++i)
			{
				var weight = weightList[i];
				var questionCount = (int)(neededCoef * weight);
				if (questionCount > neededQuestionsCount)
				{
					questionCount = neededQuestionsCount;
				}
				
				var rangeToAdd = testQuestions
					.Where(x => x.TestQuestionDificulty == TestTaskDificultyWeigths.Keys.ToList()[i])
					.Take(questionCount);

				if (rangeToAdd.Any())
				{
					questionList.AddRange(rangeToAdd);
					neededQuestionsCount -= rangeToAdd.Count();
				}
				
			}
			if (neededQuestionsCount != 0)
			{
				var addedQuestions = questionList.Select(x => x.TestQuestionId).ToArray();
				questionList.AddRange(
					testQuestions
					.Where(x => !addedQuestions.Contains(x.TestQuestionId))
					.Take(neededQuestionsCount));
			}

			return questionList;
		}
	}
}
