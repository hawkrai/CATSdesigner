using System.Collections.Generic;

namespace LMPlatform.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using Application.Core.Data;

    public class LecturesScheduleVisiting : ModelBase
    {
        public DateTime Date { get; set; }

        public int SubjectId { get; set; }
        public TimeSpan? StartTime { get; set; }


        [DataType(DataType.Time)]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:HH:mm}")]
        public TimeSpan? EndTime { get; set; }

        public string Building { get; set; }

        public string Audience { get; set; }

        public Subject Subject { get; set; }

        public ICollection<LecturesVisitMark> LecturesVisitMarks { get; set; } 
    }
}