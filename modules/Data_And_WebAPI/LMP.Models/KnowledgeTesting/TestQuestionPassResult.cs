using Application.Core.Data;

namespace LMP.Models.KnowledgeTesting
{
    public class TestQuestionPassResults : ModelBase
    {
        public int StudentId { get; set; }

        public int TestId { get; set; }

        public int QuestionNumber { get; set; }

        public int Result { get; set; }
    }
}