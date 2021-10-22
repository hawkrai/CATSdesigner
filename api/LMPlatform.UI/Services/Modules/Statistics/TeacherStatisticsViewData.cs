using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace LMPlatform.UI.Services.Modules.Statistics
{
    [DataContract]
    public class TeacherStatisticsViewData : ResultViewData
    {
        [DataMember]
        public List<SubjectStatisticsViewResult> SubjectStatistics { get; set; }
    }
}