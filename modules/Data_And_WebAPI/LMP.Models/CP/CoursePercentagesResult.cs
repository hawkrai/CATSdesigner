using System.ComponentModel.DataAnnotations;

namespace LMP.Models.CP
{
    public class CoursePercentagesResult
    {
        public int Id { get; set; }

        public int CoursePercentagesGraphId { get; set; }

        public int StudentId { get; set; }

        public int? Mark { get; set; }

        public string Comments { get; set; }

        public CoursePercentagesGraph CoursePercentagesGraph { get; set; }

        public Student Student { get; set; }
    }
}