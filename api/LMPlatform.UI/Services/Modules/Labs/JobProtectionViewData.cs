using LMPlatform.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace LMPlatform.UI.Services.Modules.Labs
{
    [DataContract]
    public class JobProtectionViewData : ResultViewData
    {
        [DataMember]
        public int? LabId { get; set; }

        [DataMember]
        public int StudentId { get; set; }

        [DataMember]
        public bool IsReturned { get; set; }

        [DataMember]
        public bool IsReceived { get; set; }

        [DataMember]
        public string LabName { get; set; }

        [DataMember]
        public bool HasProtection { get; set; }

    }

}