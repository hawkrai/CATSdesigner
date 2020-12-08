using LMPlatform.Models.AdaptivityLearning;
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

		IEnumerable<ConceptThema> GetAllAvaiableThemas(int conceptId, int userId);
		void SaveThemaResult(ThemaResults themaSolutions, int themaId, int userId);
	}
}
