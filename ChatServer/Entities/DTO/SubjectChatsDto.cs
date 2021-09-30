using System;
using System.Collections.Generic;
using System.Text;

namespace Entities.DTO
{
    public class SubjectChatsDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ShortName { get; set; }
        public string Color { get; set; }
        public int Unread { get; set; }
        public List<GroupChatDto> Groups { get; set; }
    }
}
