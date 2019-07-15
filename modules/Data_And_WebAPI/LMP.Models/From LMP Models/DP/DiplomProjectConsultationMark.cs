using System.ComponentModel.DataAnnotations;

namespace LMP.Models.From_LMP_Models.DP
{
    public class DiplomProjectConsultationMark
    {
        public int Id { get; set; }

        public int ConsultationDateId { get; set; }

        public int StudentId { get; set; }

        //PROBLEM
        //todo: make it as byte
        [StringLength(2)] public string Mark { get; set; }

        //PROBLEM
        [StringLength(50)] public string Comments { get; set; }

        public virtual DiplomProjectConsultationDate DiplomProjectConsultationDate { get; set; }

        public Student Student { get; set; }
    }
}