using LMPlatform.Models;
using LMPlatform.UI.Services.Modules.Subjects;
using System;
using System.Collections.Generic;

namespace LMPlatform.UI.Services.Modules.News
{
    public class ProfileNews
    {
        public string Title
        {
            get;
            set;
        }

        public string Body
        {
            get;
            set;
        }

        public bool Disabled
        {
            get;
            set;
        }

        public DateTime EditDate
        {
            get;
            set;
        }

        public int SubjectId
        {
            get;
            set;
        }

        public ProfileSubject Subject
        {
            get;
            set;
        }

        public int Id
        {
            get;
            set;
        }

        public IEnumerable<Attachment> Attachments { get; set; }
    }
}