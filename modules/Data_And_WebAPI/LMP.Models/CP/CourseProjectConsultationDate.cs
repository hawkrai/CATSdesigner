using System;
using System.Collections.Generic;

namespace LMP.Models.CP
{
    public class CourseProjectConsultationDate
    {
        private DateTime _day;

        public CourseProjectConsultationDate()
        {
            CourseProjectConsultationMarks = new HashSet<CourseProjectConsultationMark>();
        }

        public int Id { get; set; }

        public int LecturerId { get; set; }

        public int? SubjectId { get; set; }

        public virtual Subject Subject { get; set; }

        public DateTime Day
        {
            get =>
                _day.Kind == DateTimeKind.Unspecified
                    ? DateTime.SpecifyKind(_day, DateTimeKind.Utc)
                    : _day.ToUniversalTime();

            set => _day = value;
        }

        public virtual ICollection<CourseProjectConsultationMark> CourseProjectConsultationMarks { get; set; }
    }
}