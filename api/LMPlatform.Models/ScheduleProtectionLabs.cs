using System.Collections.Generic;

namespace LMPlatform.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using Application.Core.Data;

    public class ScheduleProtectionLabs : ScheduleBase
    {
        public int? SubjectId { get; set; }

        public Subject Subject { get; set; }
        public int SuGroupId { get; set; }

        public SubGroup SubGroup { get; set; }

        public ICollection<ScheduleProtectionLabMark> ScheduleProtectionLabMarks { get; set; }

        public ICollection<Note> Notes { get; set; } = new List<Note>();
    }
}