using System;

namespace LMP.Models.CP
{
    public class AssignedCourseProject
    {
        public int Id { get; set; }

        public int StudentId { get; set; }

        public int CourseProjectId { get; set; }

        public DateTime? ApproveDate { get; set; }

        public int? Mark { get; set; }

        public CourseProject CourseProject { get; set; }

        public Student Student { get; set; }
    }
}