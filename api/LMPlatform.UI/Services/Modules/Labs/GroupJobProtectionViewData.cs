using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace LMPlatform.UI.Services.Modules.Labs
{
 
    [DataContract]
    public class GroupJobProtectionViewData : ResultViewData
    {
        [DataMember]
        public IEnumerable<StudentJobProtectionViewData> StudentsJobProtections { get; set; }
    }
}