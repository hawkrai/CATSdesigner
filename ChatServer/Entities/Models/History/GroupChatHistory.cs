using System;
using System.Collections.Generic;
using System.Text;
using Entities.Models.GroupChatModels;

namespace Entities.Models.History
{
    public class GroupChatHistory
    {
        public int Id { get; set; }

        public DateTime Date { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public int GroupChatId { get; set; }
        public GroupChat GroupChat { get; set; }
    }
}
