using System;
using System.Collections.Generic;
using System.Text;

namespace Entities.DTO
{
    public class GroupChatDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Img { get; set; }
        public int GroupId { get; set; }
        public int Unread { get; set; }
    }
}
