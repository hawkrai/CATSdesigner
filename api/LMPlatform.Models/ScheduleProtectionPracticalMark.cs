using Application.Core.Data;

namespace LMPlatform.Models
{
    public class ScheduleProtectionPracticalMark : ScheduleProtectionMarkBase
    {
        public int ScheduleProtectionPracticalId { get; set; }

        public ScheduleProtectionPractical ScheduleProtectionPractical { get; set; }

        public int StudentId { get; set; }
        public Student Student { get; set; }

        public ScheduleProtectionPracticalMark() { }

        public ScheduleProtectionPracticalMark(int id, int studentId, string comment, string mark, int scheduleProtectionId, bool showForStudent)
            : base(id, comment, mark, showForStudent)
        {
            ScheduleProtectionPracticalId = scheduleProtectionId;
            StudentId = studentId;
        }

    }
}