using System;
using Application.Core.Data;

namespace LMP.Models
{
    public class SubjectNews : ModelBase
    {
        public string Title { get; set; }

        public string Body { get; set; }

        public bool Disabled { get; set; }

        public DateTime EditDate { get; set; }

        public int SubjectId { get; set; }

        public Subject Subject { get; set; }
    }
}