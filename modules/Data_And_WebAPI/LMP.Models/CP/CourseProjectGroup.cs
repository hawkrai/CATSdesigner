namespace LMP.Models.CP
{
    public class CourseProjectGroup
    {
        public int CourseProjectGroupId { get; set; }

        public int CourseProjectId { get; set; }

        public int GroupId { get; set; }

        public CourseProject CourseProject { get; set; }

        public Group Group { get; set; }
    }
}