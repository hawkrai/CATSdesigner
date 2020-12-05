using Application.Core.Data;
using LMPlatform.Data.Repositories;
using LMPlatform.Models;
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
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				return repositoriesContainer.AdaptiveLearningProgressRepository.GetAll()
					.Where(x => x.SubjectId == subjectId && x.UserId == userId)
					.Select(x => new ConceptThema 
					{
						ThemaId = x.ConceptId,
						ThemaResume = (ThemaResume)Enum.ToObject(typeof(ThemaResume), x.ThemaSolution),
						FinalThemaResult = (ThemaResults)Enum.ToObject(typeof(ThemaResume), x.FinalThemaResult),
						DateOfPass = x.PassedDate
					});
			}

		}

		public IEnumerable<PredTestResults> GetPredTestResults(int testId, int userId)
		{
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				IRepositoryBase<AnswerOnTestQuestion> repository = repositoriesContainer.RepositoryFor<AnswerOnTestQuestion>();
				var questionsId = repository.GetAll()
					.Where(testAnswer => testAnswer.TestId == testId && testAnswer.UserId == userId)
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
					ThemaResult = (int)((x.ResSum / (double)x.Count) * 100)
				});
			}

		}

		public void SaveProcessedPredTestResult(int subjectId, int userId, IEnumerable<PredTestResults> predTestResults)
		{
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				foreach (var predTestRes in predTestResults)
				{
					var adaptiveThemaDescr = new AdaptiveLearningProgress
					{
						UserId = userId,
						SubjectId = subjectId,
						ConceptId = predTestRes.ThemaId,
						ThemaSolution = (int)predTestRes.ThemaResume,
						FinalThemaResult = null,
						PassedDate = predTestRes.ThemaResume == ThemaResume.LEARNED ? DateTime.Today : default(DateTime?)
					};

					repositoriesContainer.AdaptiveLearningProgressRepository.Save(adaptiveThemaDescr);
				}				 
				repositoriesContainer.ApplyChanges();
			}
		}

		
		public void SaveThemaResult(ThemaResults themaSolutions, int themaId, int userId)
		{
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				var recordToUpdate = repositoriesContainer.AdaptiveLearningProgressRepository.GetAll()
					.SingleOrDefault(x => x.ConceptId == themaId && x.UserId == userId);

				if (recordToUpdate != null)
				{
					recordToUpdate.FinalThemaResult = (int)themaSolutions;
					
					repositoriesContainer.AdaptiveLearningProgressRepository.Save(recordToUpdate);
					repositoriesContainer.ApplyChanges();
				}			
			}
		}

		public int CreateDynamicTestForUser(int subjectId)
		{
			var test =  new Test
			{
				Title = "DynamicTest",
				Description = "Dynamicly created test for adaptive learning",
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
