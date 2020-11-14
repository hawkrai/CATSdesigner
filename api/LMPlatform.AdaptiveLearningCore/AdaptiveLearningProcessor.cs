using LMPlatform.AdaptiveLearningCore.BaseAdaptivityAlgorithm;
using LMPlatform.AdaptiveLearningCore.ExtendedAdaptivityAlgorithm;
using LMPlatform.AdaptiveLearningCore.Models;
using LMPlatform.AdaptiveLearningCore.Shared;
using LMPlatform.AdaptiveLearningCore.SimpleAdaptivityAlgorithm;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMPlatform.AdaptiveLearningCore
{
    public class AdaptiveLearningProcessor
    {
        private readonly IAdaptivityAlgorithm adaptivityAlgorithm;
        
        public AdaptiveLearningProcessor(AdaptivityType type)
        {
            adaptivityAlgorithm = AdaptivityAlgorithmCreator.GetAlgorithmByType(type);
        }

        public ThemaResult GetResultByCurrentThema(int currentThemaId, int currentThemaResult, IEnumerable<ConceptThema> allAvilableThemas)
        {
            return adaptivityAlgorithm.GetResultByCurrentThema(currentThemaId, currentThemaResult, allAvilableThemas);
        }

        public List<int> GetNeededThemaList(IEnumerable<PredTestResults> predTestResults)
        {
            adaptivityAlgorithm.MarkAllAvailableThemas(predTestResults);

            return predTestResults.Where(x => x.ThemaResume == ThemaResume.NEED_TO_LEARN).Select(x => x.ThemaId).ToList();
        }

        public List<int> PrepareListOfTestQuestions(IEnumerable<ThemaResult> prevThemaResult, IEnumerable<TestQuestion> testQuestions,
            int monitoringByStudent, int monitoringByDefault, int neededQuestionCount)
        {
            return adaptivityAlgorithm.PrepareTestQuestionsByDifficulty(prevThemaResult, testQuestions, monitoringByStudent, 
                monitoringByDefault, neededQuestionCount);
        }
    }
}
