using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace LMPlatform.UI.Services.Modules.Parental
{
    [DataContract]
    public class ParentalResult : ResultViewData
    {
        [DataMember]
        public List<ParentalUser> Students { get; set; }

        [DataMember]
        public string GroupName { get; set; }

        [DataMember]
        public string UserName { get; set; }
    }
}