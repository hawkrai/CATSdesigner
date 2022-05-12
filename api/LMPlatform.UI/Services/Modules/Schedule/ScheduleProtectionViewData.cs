using LMPlatform.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace LMPlatform.UI.Services.Modules.Schedule
{
    [DataContract]
    public class ScheduleProtectionViewData
    {

        public ScheduleProtectionViewData(DateTime date, TimeSpan? startTime, TimeSpan? endTime, string building, string audience, int? subjectId, Lecturer lecturer)
        {
            Date = date.ToString("dd.MM.yyyy");
            StartTime = startTime?.ToString(@"hh\:mm");
            EndTime = endTime?.ToString(@"hh\:mm");
            Building = building;
            Audience = audience;
            SubjectId = subjectId;
            Lector = new LectorViewData(lecturer, true);
        }
        [DataMember]
        public int? SubjectId { get; set; }

        [DataMember]
        public string Date { get; set; }
        [DataMember]
        public string StartTime { get; set; }
        [DataMember]
        public string EndTime { get; set; }
        [DataMember]
        public string Building { get; set; }
        [DataMember]
        public string Audience { get; set; }

        [DataMember]
        public LectorViewData Lector { get; set; }
    }
}