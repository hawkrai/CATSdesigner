using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Core.Data;

namespace LMPlatform.Models
{
    public class Attendance : ModelBase
    {
        public int UserId { get; set; }

        public User User { get; set; }

        public DateTime Login { get; set; }
    }
}
