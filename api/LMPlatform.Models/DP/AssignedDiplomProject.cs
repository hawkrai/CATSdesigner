using System;

namespace LMPlatform.Models.DP
{
    public class AssignedDiplomProject
    {
        public int Id { get; set; }

        public int StudentId { get; set; }

        public int DiplomProjectId { get; set; }

        public DateTime? ApproveDate { get; set; }

        public int? Mark { get; set; }

        public virtual DiplomProject DiplomProject { get; set; }

        public virtual Student Student { get; set; }

        public string Comment { get; set; }

        public bool ShowForStudent { get; set; }

        public string LecturerName { get; set; }

        public DateTime? MarkDate { get; set; }
    }
}
