using Entities.Models.History;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Entities.Models
{
    public class Chat
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<User> Users { get; set; }
        public List<ChatMessage> Messages { get; set; }
        public List<UserChatHistory> UserChatHistory { get; set; } = new List<UserChatHistory>();
    }
}
