using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace LMPlatform.UI.Services.Modules.Schedule
{
    [DataContract]
    public class ScheduleViewResult : ResultViewData
    {
        [DataMember]
        public IEnumerable<ScheduleViewData> Schedule { get; set; }
    }
}