using System;
using System.Collections.Generic;

namespace LMPlatform.Models.CP
{
    public class CourseProjectConsultationDate
    {
        public CourseProjectConsultationDate()
        {
            CourseProjectConsultationMarks = new HashSet<CourseProjectConsultationMark>();
        }

        public int Id { get; set; }

        public int LecturerId { get; set; }

        public int SubjectId { get; set; }

        public virtual Subject Subject { get; set; }

        private DateTime _day;

        public DateTime Day
        {
            get
            {
                return _day.Kind == DateTimeKind.Unspecified
                    ? DateTime.SpecifyKind(_day, DateTimeKind.Utc)
                    : _day.ToUniversalTime();
            }

            set
            {
                _day = value;
            }
        }

        public TimeSpan? StartTime { get; set; }

        public TimeSpan? EndTime { get; set; }

        public string Building { get; set; }

        public string Audience { get; set; }

        public virtual ICollection<CourseProjectConsultationMark> CourseProjectConsultationMarks { get; set; }
    }
}
