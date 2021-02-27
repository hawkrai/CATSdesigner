using LMPlatform.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Infrastructure.Models
{
    public class ScheduleModel
    {
        public int Id { get; set; }
        public TimeSpan? Start { get; set; }
        public TimeSpan? End { get; set; }
        public ClassType Type { get; set; }

        public DateTime Date { get; set; }
        public string Audience { get; set; }

        public string Building { get; set; }

        public string Color { get; set; }

        public string Name { get; set; }

        public string ShortName { get; set; }

        public int? SubjectId { get; set; }

        public Lecturer Teacher { get; set; }

        public IEnumerable<Note> Notes { get; set; }

    }

    public enum ClassType
    {
        Lecture,
        Practical,
        Lab
    }
}
