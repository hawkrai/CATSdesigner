using System.Collections.Generic;

namespace LMPlatform.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using Application.Core.Data;

    public class ScheduleProtectionLabs : ModelBase
    {
        public int? SubjectId { get; set; }

        public Subject Subject { get; set; }

        public TimeSpan? StartTime { get; set; }

        public TimeSpan? EndTime { get; set; }

        public string Building { get; set; }

        public string Audience { get; set; }

        public DateTime Date { get; set; }

        public int SuGroupId { get; set; }

        public SubGroup SubGroup { get; set; }

        public ICollection<ScheduleProtectionLabMark> ScheduleProtectionLabMarks { get; set; }
    }
}