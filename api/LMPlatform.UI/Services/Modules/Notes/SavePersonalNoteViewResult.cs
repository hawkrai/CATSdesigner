using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LMPlatform.UI.Services.Modules.Notes
{
    public class SavePersonalNoteViewResult : ResultViewData
    {
        public UserNoteViewData Note { get; set; }
    }
}