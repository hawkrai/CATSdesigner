using System;
using System.Collections.Generic;
using System.Text;

namespace Entities.Models
{
    public class ChatMessage
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public DateTime Time { get; set; }
        public string ImageContent { get; set; }
        public bool? Isimage { get; set; }
        public bool? Isfile { get; set; }
        public string FileContent { get; set; }
        public string FileSize { get; set; }

        public Chat Chat { get; set; }
        public int ChatId { get; set; }

        public User User { get; set; }
        public int UserId { get; set; }
    }
}
