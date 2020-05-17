using System;

namespace LMP.Models.DP
{
    public class AssignedDiplomProject
    {
        public int Id { get; set; }

        public int StudentId { get; set; }

        public int DiplomProjectId { get; set; }

        public DateTime? ApproveDate { get; set; }

        public int? Mark { get; set; }

        public DiplomProject DiplomProject { get; set; }

        public Student Student { get; set; }
    }
}