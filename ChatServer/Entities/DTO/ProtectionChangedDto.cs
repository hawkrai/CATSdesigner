using System;
using System.Collections.Generic;
using System.Text;
using Entities.Models;

namespace Entities.DTO
{
    public class ProtectionChangedDto
    {
        public int SubjectId { get; set; }

        public int GroupId { get; set; }

        public int UserId { get; set; }
        public int From { get; set; }
        public ProtectionType ProtectionType { get; set; }
    }
}
