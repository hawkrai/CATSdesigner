namespace LMP.Models.CP
{
    public class CourseProjectConsultationMark
    {
        public int Id { get; set; }

        public int ConsultationDateId { get; set; }

        public int StudentId { get; set; }

        //todo: make it as byte
        public string Mark { get; set; }

        public string Comments { get; set; }

        public CourseProjectConsultationDate CourseProjectConsultationDate { get; set; }

        public Student Student { get; set; }
    }
}