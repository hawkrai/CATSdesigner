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

        public virtual string Attendance { get; set; }

        public string Avatar { get; set; }

        public string SkypeContact { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        public string About { get; set; }

        public string Answer { get; set; }

        public int? QuestionId { get; set; }

        public List<Chat> Chats { get; set; } = new List<Chat>();
        public List<ChatMessage> Messages { get; set; } = new List<ChatMessage>();

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
