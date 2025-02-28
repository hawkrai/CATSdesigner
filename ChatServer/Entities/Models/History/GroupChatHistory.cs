using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using DocumentFormat.OpenXml.Spreadsheet;
using Entities.Models.GroupChatModels;

namespace Entities.Models.History
{
    public class GroupChatHistory
    {
        public int Id { get; set; }

        public DateTime Date { get; set; }

        public int UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public virtual User User { get; set; }

        public int GroupChatId { get; set; }

        [ForeignKey(nameof(GroupChatId))]
        public virtual GroupChat GroupChat { get; set; }
    }
}
