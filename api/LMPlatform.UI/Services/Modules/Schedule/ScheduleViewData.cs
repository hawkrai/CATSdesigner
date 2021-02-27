using Application.Infrastructure.Models;
using LMPlatform.UI.Services.Modules.Notes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace LMPlatform.UI.Services.Modules.Schedule
{
    [DataContract]
    public class ScheduleViewData
    {

        public ScheduleViewData(ScheduleModel schedule)
        {
            Audience = schedule.Audience;
            Building = schedule.Building;
            Color = schedule.Color;
            End = schedule.End?.ToString(@"hh\:mm");
            Id = schedule.Id;
            Name = schedule.Name;
            ShortName = schedule.ShortName;
            Start = schedule.Start?.ToString(@"hh\:mm");
            Date = schedule.Date.ToString("dd/MM/yyyy");
            SubjectId = schedule.SubjectId;
            Teacher = schedule.Teacher == null ? null : new LectorViewData(schedule.Teacher);
            Type = schedule.Type;
            Notes = schedule.Notes?.Select(x => new NoteViewData(x)) ?? Enumerable.Empty<NoteViewData>();
        }
        [DataMember]
        public int Id { get; set; }
        [DataMember]
        public string Start { get; set; }
        [DataMember]
        public string Date { get; set; }
        [DataMember]
        public string End { get; set; }
        [DataMember]
        public ClassType Type { get; set; }
        [DataMember]
        public string Audience { get; set; }
        [DataMember]

        public string Building { get; set; }
        [DataMember]

        public string Color { get; set; }
        [DataMember]

        public string Name { get; set; }
        [DataMember]

        public string ShortName { get; set; }
        [DataMember]

        public int? SubjectId { get; set; }
        [DataMember]
        public LectorViewData Teacher { get; set; }

        [DataMember]
        public IEnumerable<NoteViewData> Notes { get; set; }
    }
}