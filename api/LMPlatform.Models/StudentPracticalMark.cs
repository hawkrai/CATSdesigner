using Application.Core.Data;

namespace LMPlatform.Models
{
    public class StudentPracticalMark : ModelBase
    {
        public int PracticalId { get; set; }

        public int StudentId { get; set; }

        public string Mark { get; set; }

        public Practical Practical { get; set; }

        public Student Student { get; set; }

        public string Comment { get; set; }

        public string Date { get; set; }

        public bool ShowForStudent { get; set; }


        public int? LecturerId { get; set; }

        public Lecturer Lecturer { get; set; }

        public StudentPracticalMark()
        {

        }

        public StudentPracticalMark(int practicalId, int studentId, int lecturerId, string mark, string comment, string date, int id, bool showForStudent)
        {
            PracticalId = practicalId;
            StudentId = studentId;
            LecturerId = lecturerId;
            Mark = mark;
            Comment = comment;
            Date = date;
            Id = id;
            ShowForStudent = showForStudent;
        }
    }
}