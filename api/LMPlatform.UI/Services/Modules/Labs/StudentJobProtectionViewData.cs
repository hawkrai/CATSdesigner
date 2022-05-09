using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace LMPlatform.UI.Services.Modules.Labs
{
    [DataContract]
    public class StudentJobProtectionViewData : ResultViewData
    {

        [DataMember]
        public string StudentName { get; set; }

        [DataMember]
        public int StudentId { get; set; }

        [DataMember]
        public int SubGroup { get; set; }

        [DataMember]
        public bool HasProtection { get; set; }

        [DataMember]
        public int GroupId { get; set; }
    }
}