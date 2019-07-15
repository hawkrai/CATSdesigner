using LMP.Models.From_App_Core_Data;

namespace LMP.Models.From_LMP_Models
{
    public class StudentLabMark : ModelBase
    {
        public StudentLabMark()
        {
        }

        public StudentLabMark(int labId, int studentId, string mark, string comment, string date, int id)
        {
            LabId = labId;
            StudentId = studentId;
            Mark = mark;
            Comment = comment;
            Date = date;
            Id = id;
        }

        public int LabId { get; set; }

        public int StudentId { get; set; }

        public string Mark { get; set; }

        public string Comment { get; set; }

        public string Date { get; set; }

        public Labs Lab { get; set; }

        public Student Student { get; set; }
    }
}