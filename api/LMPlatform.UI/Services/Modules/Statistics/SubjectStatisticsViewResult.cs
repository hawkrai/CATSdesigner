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
        public double AverageLabsMark { get; set; }
        [DataMember]

        public double AveragePracticalsMark { get; set; }

        [DataMember]
        public double AverageCourceProjectMark { get; set; }

        [DataMember]
        public double AverageTestsMark { get; set; }

        [DataMember]
        public int SubjectId { get; set; }
    }
}