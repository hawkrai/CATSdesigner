﻿using System.Collections.Generic;

namespace LMPlatform.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using Application.Core.Data;

    public class LecturesScheduleVisiting : ScheduleBase
    {
        public int SubjectId { get; set; }
        public Subject Subject { get; set; }
        public ICollection<LecturesVisitMark> LecturesVisitMarks { get; set; }

        public LecturesScheduleVisiting() { }

        public LecturesScheduleVisiting(ScheduleBase scheduleBase) : base(scheduleBase) { }
    }
}