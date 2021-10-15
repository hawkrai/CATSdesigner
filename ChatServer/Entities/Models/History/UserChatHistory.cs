using System;
using System.Collections.Generic;
using System.Text;

namespace Entities.Models.History
{
    public class UserChatHistory
    {
        public int Id { get; set; }

        public DateTime Date { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public int ChatId { get; set; }
        public Chat Chat { get; set; }
    }
}
