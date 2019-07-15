using System;
using System.Collections.Generic;

namespace LMP.Models.DP
{
    public class DiplomProjectConsultationDate
    {
        private DateTime _day;

        public DiplomProjectConsultationDate()
        {
            DiplomProjectConsultationMarks = new HashSet<DiplomProjectConsultationMark>();
        }

        public int Id { get; set; }

        public int LecturerId { get; set; }

        public DateTime Day
        {
            get =>
                _day.Kind == DateTimeKind.Unspecified
                    ? DateTime.SpecifyKind(_day, DateTimeKind.Utc)
                    : _day.ToUniversalTime();

            set => _day = value;
        }

        public ICollection<DiplomProjectConsultationMark> DiplomProjectConsultationMarks { get; set; }
    }
}