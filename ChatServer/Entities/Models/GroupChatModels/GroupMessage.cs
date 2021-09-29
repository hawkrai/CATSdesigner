using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Entities.Models.GroupChatModels
{
    public class GroupMessage
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public DateTime Time { get; set; }
        public string ImageContent { get; set; }
        public bool? Isimage { get; set; }
        public bool? Isfile { get; set; }
        public string FileContent { get; set; }
        public string FileSize { get; set; }

        public GroupChat GroupChat { get; set; }
        public int GroupChatId { get; set; }

        public User User { get; set; }
        public int UserId { get; set; }

    }
}
