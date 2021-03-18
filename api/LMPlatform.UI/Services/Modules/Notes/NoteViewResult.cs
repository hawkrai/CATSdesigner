using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace LMPlatform.UI.Services.Modules.Notes
{
    [DataContract]
    public class NoteViewResult : ResultViewData
    {
        [DataMember]
        public IEnumerable<NoteViewData> Notes { get; set; }
    }
}