using System;
using System.Collections.Generic;
using System.Text;

namespace Entities.CTO
{
    public class MessageCto
    {
        public string Text { get; set; }
        public string ImageContent { get; set; }
        public bool? Isimage { get; set; }
        public bool? Isfile { get; set; }
        public string FileContent { get; set; }
        public string FileSize { get; set; }

        public int ChatId { get; set; }

        public int UserId { get; set; }
    }
}
