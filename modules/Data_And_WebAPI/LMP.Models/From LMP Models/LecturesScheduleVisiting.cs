using System;
using System.Collections.Generic;
using LMP.Models.From_App_Core_Data;

namespace LMP.Models.From_LMP_Models
{
    public class LecturesScheduleVisiting : ModelBase
    {
        public DateTime Date { get; set; }

        public int SubjectId { get; set; }

        public Subject Subject { get; set; }

        public ICollection<LecturesVisitMark> LecturesVisitMarks { get; set; }
    }
}