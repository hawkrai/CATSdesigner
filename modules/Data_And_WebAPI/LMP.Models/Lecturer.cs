using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using LMP.Models.CP;
using LMP.Models.DP;
using LMP.Models.Interface;

namespace LMP.Models
{
    public class Lecturer : ModelBase
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string MiddleName { get; set; }

        public User User { get; set; }

        // TODO: config
        [NotMapped]
        public string FullName => $"{LastName} {FirstName} {MiddleName}";

        public ICollection<SubjectLecturer> SubjectLecturers { get; set; }

        public ICollection<DiplomProject> DiplomProjects { get; set; }

        public ICollection<DiplomPercentagesGraph> DiplomPercentagesGraphs { get; set; }

        public ICollection<DiplomProjectConsultationDate> DiplomProjectConsultationDates { get; set; }
        
        public ICollection<CourseProject> CourseProjects { get; set; }

        public ICollection<CoursePercentagesGraph> CoursePercentagesGraphs { get; set; }

        public ICollection<CourseProjectConsultationDate> CourseProjectConsultationDates { get; set; }

        public ICollection<Group> SecretaryGroups { get; set; }

        public string Skill { get; set; }

        public bool IsSecretary { get; set; }

        public bool IsActive { get; set; }

        public bool IsLecturerHasGraduateStudents { get; set; }
    }
}