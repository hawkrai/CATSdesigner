using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace LMPlatform.UI.Services.Modules.Notes
{
    [DataContract]
    public class UserNoteViewResult : ResultViewData
    {
        [DataMember]
        public IEnumerable<UserNoteViewData> Notes { get; set; }
    }
}