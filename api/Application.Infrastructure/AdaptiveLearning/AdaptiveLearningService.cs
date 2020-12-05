using Application.Core.Data;
using LMPlatform.Data.Repositories;
using LMPlatform.Models.AdaptivityLearning;
using LMPlatform.Models.KnowledgeTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Infrastructure.AdaptiveLearning
{
	public class AdaptiveLearningService : IAdaptiveLearningService
	{
		public IEnumerable<ConceptThema> GetAllAvaiableThemas(int subjectId, int userId)
		{
			return null;

		}

		public IEnumerable<PredTestResults> GetPredTestResults(int testId, int userId)
		{
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				IRepositoryBase<AnswerOnTestQuestion> repository = repositoriesContainer.RepositoryFor<AnswerOnTestQuestion>();
				var questionsId = repository.GetAll(
						new Query<AnswerOnTestQuestion>(
							testAnswer => testAnswer.TestId == testId && testAnswer.UserId == userId))
					.Select(x => new { x.QuestionId, x.Points });
					
				var questionsWithConcept = questionsId.Join(
					repositoriesContainer.QuestionsRepository.GetAll().Where(x => x.ConceptId.HasValue),
					x => x.QuestionId,
					y => y.Id,
					(x, y) => new { x.QuestionId, x.Points, y.ConceptId })
					.ToList();

				var conceptRes = questionsWithConcept
					.GroupBy(x => x.ConceptId)
					.Select(x => new 
					{ 
						Concept = x.Key, 
						ResSum = x.Sum(y => y.Points), 
						Count = x.Count()
					})
					.ToList();

				return conceptRes.Select(x => new PredTestResults()
				{
					ThemaId = x.Concept.Value,
					ThemaResult = (int)((x.ResSum / (double)x.Count) *100)
				});
			}

		}

		public void SaveProcessedPredTestResult(int conceptId, int userId, IEnumerable<PredTestResults> predTestResults)
		{
		}

		
		public void SaveThemaResult(ThemaResults themaSolutions, int themaId, int userId)
		{
		}

		public int CreateDynamicTestForUser(int subjectId)
		{
			var test =  new Test
			{
				Title = "DynamicTest",
				Description = "Dynamic created test for adaptive learning",
				TimeForCompleting = 45,
				SetTimeForAllTest = false,
				SubjectId = subjectId,
				CountOfQuestions = 10,
				ForSelfStudy = false,
				ForEUMK = false,
				BeforeEUMK = false,
				ForNN =false,
				IsNecessary = false
			};

			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				repositoriesContainer.TestsRepository.Save(test);
				repositoriesContainer.ApplyChanges();
				return repositoriesContainer.TestsRepository.GetAll().Last().Id;
			}
		}

		public int GeDynamicTestResult(int testId, int userId)
		{
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				IRepositoryBase<AnswerOnTestQuestion> repository = repositoriesContainer.RepositoryFor<AnswerOnTestQuestion>();
				return repository.GetAll(
							new Query<AnswerOnTestQuestion>(
								testAnswer => testAnswer.TestId == testId && testAnswer.UserId == userId))
							.Sum(x => x.Points);
			}
		}
	}
}
