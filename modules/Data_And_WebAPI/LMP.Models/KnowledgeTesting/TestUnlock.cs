using Application.Core.Data;

namespace LMP.Models.KnowledgeTesting
{
    public class TestUnlock : ModelBase
    {
        public int TestId { get; set; }

        public int StudentId { get; set; }

        public Student Student { get; set; }

        public Test Test { get; set; }
    }
}