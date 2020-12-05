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
		void SaveProcessedPredTestResult(int conceptId, int userId, IEnumerable<PredTestResults> predTestResults);

		int GeDynamicTestResult(int testId, int userId);
		int CreateDynamicTestForUser(int subjectId);

		IEnumerable<ConceptThema> GetAllAvaiableThemas(int subjectId, int userId);
		void SaveThemaResult(ThemaResults themaSolutions, int themaId, int userId);
	}
}
