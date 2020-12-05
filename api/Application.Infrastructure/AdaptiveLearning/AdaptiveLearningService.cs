using LMPlatform.Models.AdaptivityLearning;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Infrastructure.AdaptiveLearning
{
	public class AdaptiveLearningService : IAdaptiveLearningService
	{
		public IEnumerable<ConceptThema> GetAllAvaiableThemas(int conceptId, int userId)
		{
			return null;

		}

		public IEnumerable<PredTestResults> GetPredTestResults(int conceptId, int userId)
		{
			return null;

		}

		public void SaveProcessedPredTestResult(int conceptId, int userId, IEnumerable<PredTestResults> predTestResults)
		{
		}

		
		public void SaveThemaResult(ThemaResults themaSolutions, int themaId, int userId)
		{
		}
	}
}
