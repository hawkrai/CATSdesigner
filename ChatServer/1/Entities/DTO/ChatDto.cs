using System;
using System.Collections.Generic;
using System.Text;

namespace Entities.DTO
{
    public class ChatDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsGroup { get; set; }
        public string Profile{get;set;}
    }
}
