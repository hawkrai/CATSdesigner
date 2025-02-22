using Entities.Models.GroupChatModels;
using Entities.Models.History;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Entities.Models
{
    public class User
    {
        public int UserId { get; set; }
        
        public string UserName { get; set; }

        public bool? IsServiced { get; set; }

        public virtual DateTime? LastLogin { get; set; }

        public string Avatar { get; set; }

        public string SkypeContact { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        public string About { get; set; }

        public string Answer { get; set; }

        public int? QuestionId { get; set; }

        public bool? IsOnline { get; set; }

        public virtual ICollection<Chat> UserChats { get; set; } = new HashSet<Chat>();
        public virtual ICollection<ChatMessage> Messages { get; set; } = new HashSet<ChatMessage>();
        public virtual ICollection<GroupMessage> GroupMessages { get; set; } = new HashSet<GroupMessage>();
        public virtual ICollection<UserChatHistory> UserChatHistory { get; set; } = new HashSet<UserChatHistory>();
        public virtual ICollection<GroupChatHistory> GroupChatHistory { get; set; } = new HashSet<GroupChatHistory>();

        [NotMapped]
        public string FullName
        {
            get
            {
                return UserName;
            }
        }
    }
}
