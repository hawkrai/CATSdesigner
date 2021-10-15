using System;
using System.Collections.Generic;
using System.Text;

namespace Entities.DTO
{
    public class ChatDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        public string Name { get; set; }
        public string Img {get;set;}
        public int Unread { get; set; }
        public bool? IsOnline { get; set; }
    }
}
