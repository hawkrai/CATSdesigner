using System.ComponentModel.DataAnnotations;

namespace LMP.Models.DP
{
    public class DiplomPercentagesResult
    {
        public int Id { get; set; }

        public int DiplomPercentagesGraphId { get; set; }

        public int StudentId { get; set; }

        public int? Mark { get; set; }

        //PROBLEM
        [StringLength(50)] public string Comments { get; set; }

        public virtual DiplomPercentagesGraph DiplomPercentagesGraph { get; set; }

        public virtual Student Student { get; set; }
    }
}