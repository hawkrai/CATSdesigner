using Entities.Models.History;
using System;
using System.Collections.Generic;

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

    }
}
