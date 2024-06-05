using System;

namespace Application.Infrastructure.CTO
{
    public class CourseProjectConsultationDateData
    {
        public int? Id { get; set; }

        public LecturerData Teacher { get; set; }

        public DateTime Day { get; set; }

        public SubjectData Subject { get; set; }

        public TimeSpan? StartTime { get; set; }

        public TimeSpan? EndTime { get; set; }

        public string Building { get; set; }

        public string Audience { get; set; }

        public int GroupId { get; set; }
    }
}
