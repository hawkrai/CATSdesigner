using System;
using LMP.Models.From_App_Core_Data;

namespace LMP.Models.From_LMP_Models
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