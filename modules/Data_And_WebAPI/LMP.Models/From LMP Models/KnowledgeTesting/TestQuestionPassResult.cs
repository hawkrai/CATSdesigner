using LMP.Models.From_App_Core_Data;

namespace LMP.Models.From_LMP_Models.KnowledgeTesting
{
    public class TestQuestionPassResults : ModelBase
    {
        public int StudentId { get; set; }

        public int TestId { get; set; }

        public int QuestionNumber { get; set; }

        public int Result { get; set; }
    }
}