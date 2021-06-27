using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace LMPlatform.UI.Services.Modules.News
{
    [DataContract]

    public class TelegramNewsResult
    {
        [DataMember]
        public List<TelegramNewsViewModel> News { get; set; }
    }
}