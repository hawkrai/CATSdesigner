using System.ComponentModel.DataAnnotations;

namespace LMP.Models.DP
{
    public class DiplomPercentagesResult
    {
        public int Id { get; set; }

        public int DiplomPercentagesGraphId { get; set; }

        public int StudentId { get; set; }

        public int? Mark { get; set; }

        public string Comments { get; set; }

        public DiplomPercentagesGraph DiplomPercentagesGraph { get; set; }

        public Student Student { get; set; }
    }
}