using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace LMPlatform.UI.Services.Modules.CoreModels
{
    [DataContract]
    public class GroupResult
    {
        [DataMember]
        public GroupsViewData Group { get; set; }
    }
}