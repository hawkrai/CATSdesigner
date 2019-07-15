using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LMP.Models.DP
{
    public class DiplomPercentagesGraph
    {
        private DateTime _date;

        public DiplomPercentagesGraph()
        {
            DiplomPercentagesResults = new HashSet<DiplomPercentagesResult>();
        }

        public int Id { get; set; }

        public int LecturerId { get; set; }

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

        public ICollection<DiplomPercentagesResult> DiplomPercentagesResults { get; set; }

        public ICollection<DiplomPercentagesGraphToGroup> DiplomPercentagesGraphToGroups { get; set; }

        public Lecturer Lecturer { get; set; }
    }
}