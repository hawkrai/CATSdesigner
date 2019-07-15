using System.Collections.Generic;

namespace LMP.Models.From_LMP_Models.KnowledgeTesting
{
    public class RealTimePassingResult
    {
        public string StudentName { get; set; }

        public string TestName { get; set; }

        public List<PassedQuestionResult> PassResults { get; set; }
    }
}