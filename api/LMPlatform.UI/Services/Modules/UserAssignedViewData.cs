using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace LMPlatform.UI.Services.Modules
{
    [DataContract]
    public class UserAssignedViewData
    {
        [DataMember]
        public bool IsAssigned { get; set; }
    }
}