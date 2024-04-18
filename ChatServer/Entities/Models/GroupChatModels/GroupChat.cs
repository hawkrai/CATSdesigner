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
        public int? GroupId { get; set; }
        public bool IsSubjectGroup { get; set; }
        public int? SubjectId { get; set; }

        public List<GroupMessage> GroupMessages { get; set; } = new List<GroupMessage>();
        public List<GroupChatHistory> GroupChatHistory { get; set; } = new List<GroupChatHistory>();
        
        [ForeignKey("SubjectId")]
        public Subject Subjects { get; set; }

    }
}
