using System;
using System.Collections.Generic;

namespace Application.Infrastructure.DTO
{
    public class StudentData
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Group { get; set; }

        public int? Mark { get; set; }

        public int? AssignedDiplomProjectId { get; set; }

        public string Lecturer { get; set; }

        public IEnumerable<PercentageResultData> PercentageResults { get; set; }

        public IEnumerable<DiplomProjectConsultationMarkData> DiplomProjectConsultationMarks { get; set; }

        public string Comment { get; set; }

        public bool? ShowForStudent { get; set; }

        public string LecturerName { get; set; }

        public DateTime? MarkDate { get; set; }
    }
}
