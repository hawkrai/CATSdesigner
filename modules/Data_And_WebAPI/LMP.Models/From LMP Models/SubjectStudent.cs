using LMP.Models.From_App_Core_Data;

namespace LMP.Models.From_LMP_Models
{
    public class SubjectStudent : ModelBase
    {
        public int StudentId { get; set; }

        public int SubGroupId { get; set; }

        public int SubjectGroupId { get; set; }

        public Student Student { get; set; }

        public SubGroup SubGroup { get; set; }

        public SubjectGroup SubjectGroup { get; set; }
    }
}