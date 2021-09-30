using System;
using System.Collections.Generic;
using System.Text;

namespace Entities.DTO
{
    public class UserDto
    {
        public int UserId { get; set; }
        public int GroupId { get; set; }
        public string FullName { get; set; }
        public string Profile { get; set; }
        public bool isOnline { get; set; }
    }
}
