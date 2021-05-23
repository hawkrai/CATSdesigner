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
		public IEnumerable<ConceptThema> GetAllAvaiableThemas(int subjectId, int adaptivityId, int userId)
		{
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				return repositoriesContainer.AdaptiveLearningProgressRepository.GetAll()
					.Where(x => x.SubjectId == subjectId && x.UserId == userId && x.AdaptivityId == adaptivityId)
					.Select(x => new ConceptThema 
					{
						ThemaId = x.ConceptId,
						ThemaResume = (ThemaResume)x.ThemaSolution,
						FinalThemaResult = (ThemaResults?)x.FinalThemaResult,
						DateOfPass = x.PassedDate
					})
					.ToList();
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

		public void SaveProcessedPredTestResult(int testId, int userId, int adaptivityId, IEnumerable<PredTestResults> predTestResults)
		{
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				var subjectId = repositoriesContainer.TestsRepository.GetAll().First(x => x.Id == testId).SubjectId;
				foreach (var predTestRes in predTestResults)
				{
					var adaptiveThemaDescr = new AdaptiveLearningProgress
					{
						UserId = userId,
						SubjectId = subjectId,
						ConceptId = predTestRes.ThemaId,
						AdaptivityId = adaptivityId,
						ThemaSolution = (int)predTestRes.ThemaResume,
						FinalThemaResult = null,
						PassedDate = predTestRes.ThemaResume == ThemaResume.LEARNED ? DateTime.Today : default(DateTime?)
					};

					repositoriesContainer.AdaptiveLearningProgressRepository.Save(adaptiveThemaDescr);
				}				 
				repositoriesContainer.ApplyChanges();
			}
		}

		
		public void SaveThemaResult(ThemaResults themaRes, ThemaSolutions nextStepSolution, int themaId, int adaptivityId, int userId)
		{
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				var recordToUpdate = repositoriesContainer.AdaptiveLearningProgressRepository.GetAll()
					.SingleOrDefault(x => x.ConceptId == themaId && x.UserId == userId && x.AdaptivityId == adaptivityId);

				if (recordToUpdate != null)
				{
					recordToUpdate.FinalThemaResult = (int)themaRes;
					if (nextStepSolution != ThemaSolutions.REPEAT_CURRENT)
					{
						recordToUpdate.PassedDate = DateTime.Today;
						recordToUpdate.ThemaSolution = (int)ThemaResume.LEARNED;
					}
					
					repositoriesContainer.AdaptiveLearningProgressRepository.Save(recordToUpdate);
					repositoriesContainer.ApplyChanges();
				}			
			}
		}

		public int CreateDynamicTestForUser(int subjectId, int questionsCount)
		{
			var test =  new Test
			{
				Title = AdaptiveConst.AdaptiveTestName,
				Description = "Dynamicly created test for adaptive learning",
				TimeForCompleting = 45,
				SetTimeForAllTest = false,
				SubjectId = subjectId,
				CountOfQuestions = questionsCount,
				ForSelfStudy = false,
				ForEUMK = true,
				BeforeEUMK = false,
				ForNN = false,
				IsNecessary = false
			};

			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				repositoriesContainer.TestsRepository.Save(test);
				repositoriesContainer.ApplyChanges();
				return repositoriesContainer.TestsRepository.GetAll().ToList().Last().Id;
			}
		}

		public int GeDynamicTestResult(int testId, int userId)
		{
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				IRepositoryBase<AnswerOnTestQuestion> repository = repositoriesContainer.RepositoryFor<AnswerOnTestQuestion>();
				return 10 * repository.GetAll(
							new Query<AnswerOnTestQuestion>(
								testAnswer => testAnswer.TestId == testId && testAnswer.UserId == userId))
							.Sum(x => x.Points);
			}
		}

		public void ClearDynamicTestData(int testId)
		{
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				IRepositoryBase<AnswerOnTestQuestion> answerRepository = repositoriesContainer.RepositoryFor<AnswerOnTestQuestion>();
				var answersForDelete = answerRepository.GetAll().Where(x => x.TestId == testId);
				answerRepository.Delete(answersForDelete);

				IRepositoryBase<TestPassResult> testPassRepository = repositoriesContainer.RepositoryFor<TestPassResult>();
				var testPassResForDelete = testPassRepository.GetAll().Where(x => x.TestId == testId);
				testPassRepository.Delete(testPassResForDelete);

				var questionsForDelete = repositoriesContainer.QuestionsRepository.GetAll().Where(x => x.TestId == testId);
				repositoriesContainer.QuestionsRepository.Delete(questionsForDelete);
				
				var tetsQuestPassResForDelete = repositoriesContainer.TestQuestionPassResultsRepository.GetAll().Where(x => x.TestId == testId);
				repositoriesContainer.TestQuestionPassResultsRepository.Delete(tetsQuestPassResForDelete);
				
				var testsForDelete = repositoriesContainer.TestsRepository.GetAll().Where(x => x.Id == testId);
				repositoriesContainer.TestsRepository.Delete(testsForDelete);
				
			}
		}

		public void ClearAllEducationData(int userId)
		{
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				var dataToDelete = repositoriesContainer.AdaptiveLearningProgressRepository
					.GetAll()
					.Where(x => x.UserId == userId);

				repositoriesContainer.AdaptiveLearningProgressRepository.Delete(dataToDelete);
			}
		}
	}
}
