using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Application.Core.Data;
using LMPlatform.Models.DP;
using LMPlatform.Models.KnowledgeTesting;
using LMPlatform.Models.CP;
using System;

namespace LMPlatform.Models
{
    public class Student : ModelBase
    {
	    public string Email { get; set; }

	    public string FirstName { get; set; }

	    public string LastName { get; set; }

	    public string MiddleName { get; set; }

	    public bool? Confirmed { get; set; }

        public int? ConfirmedById { get; set; }

        public Lecturer ConfirmedBy { get; set; }

        public DateTime? ConfirmedAt { get; set; }

	    public User User { get; set; }

	    public int GroupId { get; set; }

	    public Group Group { get; set; }

        [NotMapped]
        public string FullName => $"{LastName?.Trim()} {FirstName?.Trim()} {MiddleName?.Trim()}";

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

        public bool? IsActive { get; set; }

        public DateTime? DeletedOn { get; set; }
    }
}