using System;
using System.Collections.Generic;
using Application.Core.Data;

namespace LMP.Models
{
    public class ScheduleProtectionLabs : ModelBase
    {
        public DateTime Date { get; set; }

        public int SuGroupId { get; set; }

        public SubGroup SubGroup { get; set; }

        public ICollection<ScheduleProtectionLabMark> ScheduleProtectionLabMarks { get; set; }
    }
}