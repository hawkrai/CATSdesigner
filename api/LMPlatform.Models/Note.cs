using Application.Core.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMPlatform.Models
{
    public class Note : ModelBase
    {
        public string Text { get; set; }

        public DateTime Date { get; set; }

        public TimeSpan Time { get; set; }

        public int UserId { get; set; }

        public User User { get; set; }

        public int SubjectId { get; set; }

        public Subject Subject { get; set; }

    }
}
