using Application.Core.Data;

namespace LMPlatform.Models
{
    public class ScheduleProtectionLabMark : ScheduleProtectionMarkBase
    {
        public int ScheduleProtectionLabId { get; set; }

        public int StudentId { get; set; }
        public Student Student { get; set; }
        public ScheduleProtectionLabs ScheduleProtectionLab { get; set; }

        public ScheduleProtectionLabMark() { }

        public ScheduleProtectionLabMark(int id, int studentId, string comment, string mark, int scheduleProtectionId, bool showForStudent)
            :base(id, comment, mark, showForStudent)
        {
            ScheduleProtectionLabId = scheduleProtectionId;
            StudentId = studentId;
        }
    }
}