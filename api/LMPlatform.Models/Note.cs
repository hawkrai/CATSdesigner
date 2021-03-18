using Application.Core.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMPlatform.Models
{
    public class Note : ModelBase
    {
        public string Text { get; set; }

        public int UserId { get; set; }

        public User User { get; set; }

        public int? LecturesScheduleId { get; set; }

        public LecturesScheduleVisiting LecturesSchedule { get; set; }

        public int? LabsScheduleId { get; set; }

        public ScheduleProtectionLabs LabsSchedule { get; set; }

        public int? PracticalScheduleId { get; set; }

        public ScheduleProtectionPractical PracticalSchedule { get; set; }


    }
}
