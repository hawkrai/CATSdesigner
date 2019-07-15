namespace LMP.Models.CP
{
    public class CoursePercentagesGraphToGroup
    {
        public int CoursePercentagesGraphToGroupId { get; set; }

        public int CoursePercentagesGraphId { get; set; }

        public int GroupId { get; set; }

        public Group Group { get; set; }

        public CoursePercentagesGraph CoursePercentagesGraph { get; set; }
    }
}