using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace LMPlatform.UI.Services.Modules
{
    [DataContract]
    public class UniqueViewData
    {
        [DataMember]
        public bool IsUnique { get; set; }
    }
}