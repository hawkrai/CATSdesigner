using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LMP.Models.CP
{
    public class CoursePercentagesGraph
    {
        private DateTime _date;

        public CoursePercentagesGraph()
        {
            CoursePercentagesResults = new HashSet<CoursePercentagesResult>();
        }

        public int Id { get; set; }

        public int LecturerId { get; set; }

        public int SubjectId { get; set; }

        public string Name { get; set; }

        public double Percentage { get; set; }

        public DateTime Date
        {
            get =>
                _date.Kind == DateTimeKind.Unspecified
                    ? DateTime.SpecifyKind(_date, DateTimeKind.Utc)
                    : _date.ToUniversalTime();

            set => _date = value;
        }

        public ICollection<CoursePercentagesResult> CoursePercentagesResults { get; set; }

        public ICollection<CoursePercentagesGraphToGroup> CoursePercentagesGraphToGroups { get; set; }

        public Lecturer Lecturer { get; set; }

        public Subject Subject { get; set; }
    }
}