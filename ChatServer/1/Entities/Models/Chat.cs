using System;
using System.Collections.Generic;
using System.Text;

namespace Entities.Models
{
    public class Chat
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsGroup { get; set; }
        public List<User> Users { get; set; }
        public List<ChatMessage> Messages { get; set; }
    }
}
