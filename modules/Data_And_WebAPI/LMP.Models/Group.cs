using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations.Schema;
using LMP.Models.CP;
using LMP.Models.DP;
using LMP.Models.Interface;

namespace LMP.Models
{
    public class Group : ModelBase
    {
        public Group()
        {
            Students = new Collection<Student>();
        }

        public string Name { get; set; }

        public string StartYear { get; set; }

        public string GraduationYear { get; set; }

        public ICollection<Student> Students { get; set; }

        public ICollection<SubjectGroup> SubjectGroups { get; set; }

        public ICollection<ScheduleProtectionPractical> ScheduleProtectionPracticals { get; set; }

        public virtual ICollection<DiplomProjectGroup> DiplomProjectGroups { get; set; }

        public virtual ICollection<CourseProjectGroup> CourseProjectGroups { get; set; }

        //PROBLEM
        [Column("Secretary_Id")] public int? SecretaryId { get; set; }

        public Lecturer Secretary { get; set; }
    }
}