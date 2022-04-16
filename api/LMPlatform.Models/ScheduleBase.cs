using Application.Core.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMPlatform.Models
{
    public class ScheduleBase : ModelBase
    {
        public TimeSpan? StartTime { get; set; }

        public TimeSpan? EndTime { get; set; }

        public string Building { get; set; }

        public string Audience { get; set; }

        public DateTime Date { get; set; }

        public int? LecturerId { get; set; }

        public Lecturer Lecturer { get; set; }

        public ICollection<Note> Notes { get; set; } = new List<Note>();

        public ScheduleBase() { }
        public ScheduleBase(ScheduleBase scheduleBase)
        {
            StartTime = scheduleBase.StartTime;
            EndTime = scheduleBase.EndTime;
            Building = scheduleBase.Building;
            Audience = scheduleBase.Audience;
            Date = scheduleBase.Date;
            LecturerId = scheduleBase.LecturerId;
            Notes = scheduleBase.Notes;
        }

    }
}
