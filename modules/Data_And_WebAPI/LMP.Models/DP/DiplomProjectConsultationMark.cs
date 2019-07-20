namespace LMP.Models.DP
{
    public class DiplomProjectConsultationMark
    {
        public int Id { get; set; }

        public int ConsultationDateId { get; set; }

        public int StudentId { get; set; }

        //todo: make it as byte
        public string Mark { get; set; }

        public string Comments { get; set; }

        public DiplomProjectConsultationDate DiplomProjectConsultationDate { get; set; }

        public Student Student { get; set; }
    }
}