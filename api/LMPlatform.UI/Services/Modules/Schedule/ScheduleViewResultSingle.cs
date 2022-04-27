using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace LMPlatform.UI.Services.Modules.Schedule
{
    [DataContract]
    public class ScheduleViewResultSingle : ResultViewData
    {
        [DataMember]
        public ScheduleViewData Schedule { get; set; }

        [DataMember]
        public LectorViewData Lector { get; set; }

        [DataMember]
        public string GroupName { get; set; }
    }
}