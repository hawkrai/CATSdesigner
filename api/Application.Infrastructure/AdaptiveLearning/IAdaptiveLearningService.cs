using LMPlatform.Models.AdaptivityLearning;
using LMPlatform.Models.KnowledgeTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Infrastructure.AdaptiveLearning
{
	public interface IAdaptiveLearningService
	{
		IEnumerable<PredTestResults> GetPredTestResults(int conceptId, int userId);
		void SaveProcessedPredTestResult(int conceptId, int userId, int adaptivityId, IEnumerable<PredTestResults> predTestResults);

		int GeDynamicTestResult(int testId, int userId);
		int CreateDynamicTestForUser(int subjectId, int questionsCount, int timeForCompleting, bool setTimeForAllTest);

		IEnumerable<ConceptThema> GetAllAvaiableThemas(int subjectId, int adaptivityId, int userId);
		void SaveThemaResult(ThemaResults themaSolutions, ThemaSolutions nextStepSolution, int themaId, int adaptivityId, int userId);

		void ClearDynamicTestData(int testId);
		void ClearAllEducationData(int userId);
		void ClearEducationData(int userId, int subjectId, IEnumerable<int> conceptIds, int? adaptivityId = null);
		IList<Test> GetSubjectTestsWithQuestions(int subjectId);
		bool IsTestUnlockedForStudent(int testId, int studentId);
	}
}
