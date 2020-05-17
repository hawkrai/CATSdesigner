using System;
using System.Collections.Generic;

namespace LMP.Models.CP
{
    public class CourseProject
    {
        public CourseProject()
        {
            AssignedCourseProjects = new HashSet<AssignedCourseProject>();
            CourseProjectGroups = new HashSet<CourseProjectGroup>();
        }

        public int CourseProjectId { get; set; }

        public string Theme { get; set; }

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

        public Subject Subject { get; set; }

        public Lecturer Lecturer { get; set; }

        public ICollection<AssignedCourseProject> AssignedCourseProjects { get; set; }

        public ICollection<CourseProjectGroup> CourseProjectGroups { get; set; }
    }
}