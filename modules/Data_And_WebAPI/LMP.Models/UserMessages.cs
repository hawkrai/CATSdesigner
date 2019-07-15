using System;
using System.ComponentModel.DataAnnotations;
using LMP.Models.Interface;

namespace LMP.Models
{
    public class UserMessages : ModelBase
    {
        public UserMessages()
        {
        }

        public UserMessages(int recipientId, int authorId, int messageId)
        {
            RecipientId = recipientId;
            AuthorId = authorId;
            MessageId = messageId;
            Date = DateTime.Now;
            IsRead = false;
        }

        public int RecipientId { get; set; }

        public int AuthorId { get; set; }

        public int MessageId { get; set; }

        public DateTime Date { get; set; }

        public bool IsRead { get; set; }

        public int DeletedById { get; set; }

        public User Recipient { get; set; }

        public User Author { get; set; }

        public Message Message { get; set; }
    }
}