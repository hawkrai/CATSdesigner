using LMP.Models.From_App_Core_Data;

namespace LMP.Models.From_LMP_Models
{
    public class ScheduleProtectionPracticalMark : ModelBase
    {
        public int ScheduleProtectionPracticalId { get; set; }

        public int StudentId { get; set; }

        public string Comment { get; set; }

        public string Mark { get; set; }

        public Student Student { get; set; }

        public ScheduleProtectionPractical ScheduleProtectionPractical { get; set; }
    }
}