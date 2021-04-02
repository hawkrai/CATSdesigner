using System.Runtime.Serialization;

namespace LMPlatform.UI.Services.Modules.Lectures
{
    using Models;

    [DataContract]
    public class CalendarViewData
    {
        public CalendarViewData(LecturesScheduleVisiting visiting)
        {
            SubjectId = visiting.SubjectId;
            Date = visiting.Date.ToString("dd/MM/yyy");
            Id = visiting.Id;
            StartTime = visiting.StartTime?.ToString(@"hh\:mm");
            EndTime = visiting.EndTime?.ToString(@"hh\:mm");
            Building = visiting.Building;
            Audience = visiting.Audience;
        }

        [DataMember]
        public int SubjectId { get; set; }

        [DataMember]
        public string Date { get; set; }

        [DataMember]
        public int Id { get; set; }

        [DataMember]
        public string StartTime { get; set; }

        [DataMember]
        public string EndTime { get; set; }

        [DataMember]
        public string Building { get; set; }

        [DataMember]
        public string Audience { get; set; }
    }
}
