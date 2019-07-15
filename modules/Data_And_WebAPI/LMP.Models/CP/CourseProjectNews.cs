using System;

namespace LMP.Models.CP
{
    public class CourseProjectNews
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string Body { get; set; }

        public bool Disabled { get; set; }

        public DateTime EditDate { get; set; }

        public string Attachments { get; set; }

        public int SubjectId { get; set; }

        public Subject Subject { get; set; }
    }
}