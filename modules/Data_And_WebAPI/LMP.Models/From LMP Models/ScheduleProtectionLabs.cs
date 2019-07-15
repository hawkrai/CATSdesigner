using System;
using System.Collections.Generic;
using LMP.Models.From_App_Core_Data;

namespace LMP.Models.From_LMP_Models
{
    public class ScheduleProtectionLabs : ModelBase
    {
        public DateTime Date { get; set; }

        public int SuGroupId { get; set; }

        public SubGroup SubGroup { get; set; }

        public ICollection<ScheduleProtectionLabMark> ScheduleProtectionLabMarks { get; set; }
    }
}