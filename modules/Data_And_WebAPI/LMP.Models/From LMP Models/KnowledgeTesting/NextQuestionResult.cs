using System.Collections.Generic;

namespace LMP.Models.From_LMP_Models.KnowledgeTesting
{
    public class NextQuestionResult
    {
        public Question Question { get; set; }

        public int Number { get; set; }

        public Dictionary<int, PassedQuestionResult> QuestionsStatuses { get; set; }

        public int Mark { get; set; }

        public int Percent { get; set; }

        public double Seconds { get; set; }

        public bool SetTimeForAllTest { get; set; }

        public bool ForSelfStudy { get; set; }
    }
}