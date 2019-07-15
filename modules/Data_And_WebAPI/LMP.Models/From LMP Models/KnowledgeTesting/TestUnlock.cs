using LMP.Models.From_App_Core_Data;

namespace LMP.Models.From_LMP_Models.KnowledgeTesting
{
    public class TestUnlock : ModelBase
    {
        public int TestId { get; set; }

        public int StudentId { get; set; }

        public virtual Student Student { get; set; }

        public Test Test { get; set; }
    }
}