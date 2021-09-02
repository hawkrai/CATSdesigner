using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace LMPlatform.UI.Services.Modules.Statistics
{
    [DataContract]
    public class SubjectStatisticsViewResult
    {
        [DataMember]
        public string SubjectName { get; set; }
        [DataMember]
        public decimal AverageLabsMark { get; set; }
        [DataMember]

        public decimal AveragePracticalsMark { get; set; }

        [DataMember]
        public decimal AverageCourceProjectMark { get; set; }

        [DataMember]
        public decimal AverageTestsMark { get; set; }
    }
}