using System;

namespace LMP.Models.From_LMP_Models.DP
{
    public class DiplomProjectNews
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string Body { get; set; }

        public bool Disabled { get; set; }

        public DateTime EditDate { get; set; }

        public string Attachments { get; set; }

        public int LecturerId { get; set; }

        public Lecturer Lecturer { get; set; }
    }
}