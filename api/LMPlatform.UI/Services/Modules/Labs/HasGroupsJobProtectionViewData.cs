using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace LMPlatform.UI.Services.Modules.Labs
{
    [DataContract]
    public class HasGroupsJobProtectionViewData : ResultViewData
    {
        [DataMember]
        public IEnumerable<HasGroupJobProtectionViewData> HasGroupsJobProtection { get; set; }
    }
}