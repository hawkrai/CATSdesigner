using Entities.Models.History;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

#nullable disable

namespace Entities.Models.GroupChatModels
{
    public class GroupChat
    {
        public int Id { get; set; }
        public string GroupName { get; set; }
        public string ShortName { get; set; }
        public bool IsStudentGroup { get; set; }
        public bool IsSubjectGroup { get; set; }

        public int? GroupId { get; set; }

        [ForeignKey(nameof(GroupId))]
        public virtual Group Group { get; set; }

        public int? SubjectId { get; set; }

        [ForeignKey(nameof(SubjectId))]
        public virtual Subject Subject { get; set; }

        public virtual ICollection<GroupMessage> GroupMessages { get; set; } = new HashSet<GroupMessage>();
        public virtual ICollection<GroupChatHistory> GroupChatHistory { get; set; } = new HashSet<GroupChatHistory>();



    }
}
