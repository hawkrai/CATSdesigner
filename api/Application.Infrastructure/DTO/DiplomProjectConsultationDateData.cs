using System;

namespace Application.Infrastructure.DTO
{
    public class DiplomProjectConsultationDateData
    {
        public int? Id { get; set; }

        public int? LecturerId { get; set; }

        public DateTime Day { get; set; }

        public TimeSpan? StartTime { get; set; }

        public TimeSpan? EndTime { get; set; }

        public string Building { get; set; }

        public string Audience { get; set; }
    }
}
