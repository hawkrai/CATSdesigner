using Application.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace LMPlatform.UI.Services.Modules.Schedule
{
    [DataContract]
    public class ScheduleViewData : ResultViewData
    {
        [DataMember]
        public int Id { get; set; }
        [DataMember]
        public TimeSpan? Start { get; set; }
        [DataMember]
        public TimeSpan? End { get; set; }
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
        public IEnumerable<LectorViewData> Teachers { get; set; }
    }
}