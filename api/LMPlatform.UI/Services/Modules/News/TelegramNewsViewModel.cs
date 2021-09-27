using LMPlatform.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace LMPlatform.UI.Services.Modules.News
{
    [DataContract]

    public class TelegramNewsViewModel
    {

        public TelegramNewsViewModel(SubjectNews news)
        {
            Body = news.Body;
            NewsId = news.Id;
            Title = news.Title;
            SubjectId = news.SubjectId;
            DateCreate = news.EditDate.ToString("dd.MM.yyyy");
            Disabled = news.Disabled;
            SubjectName = news.Subject.Name;
        }
        [DataMember]
        public int NewsId { get; set; }

        [DataMember]
        public int SubjectId { get; set; }

        [DataMember]
        public string Title { get; set; }

        [DataMember]
        public string Body { get; set; }

        [DataMember]
        public string DateCreate { get; set; }

        [DataMember]
        public bool Disabled { get; set; }

        [DataMember]
        public string SubjectName { get; set; }

    }
}