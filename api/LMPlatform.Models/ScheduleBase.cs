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
    }
}
