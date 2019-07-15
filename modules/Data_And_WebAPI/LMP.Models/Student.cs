using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using LMP.Models.CP;
using LMP.Models.DP;
using LMP.Models.Interface;
using LMP.Models.KnowledgeTesting;

namespace LMP.Models
{
    public class Student : ModelBase
    {
        public string Email { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string MiddleName { get; set; }

        public bool? Confirmed { get; set; }

        public User User { get; set; }

        public int GroupId { get; set; }

        public Group Group { get; set; }

        // TODO: maybe move to DbContext model config
        [NotMapped]
        public string FullName => $"{LastName} {FirstName} {MiddleName}";

        public ICollection<SubjectStudent> SubjectStudents { get; set; }

        public ICollection<TestUnlock> TestUnlocks { get; set; }

        public ICollection<AssignedDiplomProject> AssignedDiplomProjects { get; set; }

        public ICollection<AssignedCourseProject> AssignedCourseProjects { get; set; }

        public ICollection<DiplomPercentagesResult> PercentagesResults { get; set; }

        public ICollection<CoursePercentagesResult> CoursePercentagesResults { get; set; }

        public ICollection<DiplomProjectConsultationMark> DiplomProjectConsultationMarks { get; set; }

        public ICollection<CourseProjectConsultationMark> CourseProjectConsultationMarks { get; set; }

        public ICollection<LecturesVisitMark> LecturesVisitMarks { get; set; }

        public ICollection<ScheduleProtectionLabMark> ScheduleProtectionLabMarks { get; set; }

        public ICollection<StudentLabMark> StudentLabMarks { get; set; }

        public ICollection<ScheduleProtectionPracticalMark> ScheduleProtectionPracticalMarks { get; set; }

        public ICollection<StudentPracticalMark> StudentPracticalMarks { get; set; }
    }
}