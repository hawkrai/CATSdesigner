using System;

namespace Application.Infrastructure.CTO
{
    public class CourseProjectConsultationDateData
    {
        public int? Id { get; set; }

        public LecturerData Teacher { get; set; }

        public string Day { get; set; }

        public SubjectData Subject { get; set; }

        public string StartTime { get; set; }

        public string EndTime { get; set; }

        public string Building { get; set; }

        public string Audience { get; set; }

        public int GroupId { get; set; }
    }
}
