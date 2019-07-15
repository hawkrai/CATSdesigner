using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LMP.Models.From_LMP_Models.CP
{
    public class CourseProject
    {
        public CourseProject()
        {
            AssignedCourseProjects = new HashSet<AssignedCourseProject>();
            CourseProjectGroups = new HashSet<CourseProjectGroup>();
        }

        public int CourseProjectId { get; set; }

        //PROBLEM
        [Required] [StringLength(2048)] public string Theme { get; set; }

        public int? LecturerId { get; set; }

        public string InputData { get; set; }

        public string Univer { get; set; }

        public string Faculty { get; set; }

        public string HeadCathedra { get; set; }

        public string RpzContent { get; set; }

        public string DrawMaterials { get; set; }

        public string Consultants { get; set; }

        public string Workflow { get; set; }

        public DateTime? DateEnd { get; set; }

        public DateTime? DateStart { get; set; }

        public int? SubjectId { get; set; }

        public virtual Subject Subject { get; set; }

        public virtual Lecturer Lecturer { get; set; }

        public virtual ICollection<AssignedCourseProject> AssignedCourseProjects { get; set; }

        public virtual ICollection<CourseProjectGroup> CourseProjectGroups { get; set; }
    }
}