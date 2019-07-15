using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using LMP.Models.From_App_Core_Data;
using LMP.Models.From_LMP_Models.CP;
using LMP.Models.From_LMP_Models.DP;
using LMP.Models.From_LMP_Models.KnowledgeTesting;

namespace LMP.Models.From_LMP_Models
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

        //PROBLEM
        [NotMapped] public string FullName => string.Format("{0} {1} {2}", LastName, FirstName, MiddleName);

        public ICollection<SubjectStudent> SubjectStudents { get; set; }

        public ICollection<TestUnlock> TestUnlocks { get; set; }

        public virtual ICollection<AssignedDiplomProject> AssignedDiplomProjects { get; set; }

        public virtual ICollection<AssignedCourseProject> AssignedCourseProjects { get; set; }

        public virtual ICollection<DiplomPercentagesResult> PercentagesResults { get; set; }

        public virtual ICollection<CoursePercentagesResult> CoursePercentagesResults { get; set; }

        public virtual ICollection<DiplomProjectConsultationMark> DiplomProjectConsultationMarks { get; set; }

        public virtual ICollection<CourseProjectConsultationMark> CourseProjectConsultationMarks { get; set; }

        public ICollection<LecturesVisitMark> LecturesVisitMarks { get; set; }

        public ICollection<ScheduleProtectionLabMark> ScheduleProtectionLabMarks { get; set; }

        public ICollection<StudentLabMark> StudentLabMarks { get; set; }

        public ICollection<ScheduleProtectionPracticalMark> ScheduleProtectionPracticalMarks { get; set; }

        public ICollection<StudentPracticalMark> StudentPracticalMarks { get; set; }
    }
}