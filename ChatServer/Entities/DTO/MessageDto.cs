using System;
using System.Collections.Generic;
using System.Text;

namespace Entities.DTO
{
    public class MessageDto
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public string Time { get; set; }
        public string[] ImageContent { get; set; }
        public bool? Isimage { get; set; }
        public bool? Isfile { get; set; }
        public string FileContent { get; set; }
        public string FileSize { get; set; }
        public string Name { get; set; }
        public string Profile { get; set; }
        public string Align { get; set; } 
        public int ChatId { get; set; }
    }
}
