namespace LMPlatform.UI.Services.Modules.Labs
{
    using System.Linq;
    using System.Runtime.Serialization;

    using LMPlatform.Models;

    [DataContract]
    public class LabVisitingMarkViewData
    {
        public LabVisitingMarkViewData()
        {
        }

        public LabVisitingMarkViewData(Student student, int scheduleId)
        {
            ScheduleProtectionLabId = scheduleId;
            StudentId = student.Id;
            StudentName = student.FullName;
            if (student.ScheduleProtectionLabMarks.Any(e => e.ScheduleProtectionLabId == scheduleId))
            {
                var schedule = student.ScheduleProtectionLabMarks.FirstOrDefault(e => e.ScheduleProtectionLabId == scheduleId);
                Comment = schedule.Comment;
                Mark = schedule.Mark;
                LabVisitingMarkId = schedule.Id;
                ShowForStudent = schedule.ShowForStudent;
            }
            else
            {
                Comment = string.Empty;
                Mark = string.Empty;
                LabVisitingMarkId = 0;
                ShowForStudent = false;
            }
        }

        [DataMember]
        public int ScheduleProtectionLabId { get; set; }

        [DataMember]
        public int StudentId { get; set; }

        [DataMember]
        public string StudentName { get; set; }

        [DataMember]
        public string Comment { get; set; }

        [DataMember]
        public string Mark { get; set; }

        [DataMember]
        public bool ShowForStudent { get; set; }

        [DataMember]
        public int LabVisitingMarkId { get; set; }
    }
}