using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using LMP.Models.Interface;
using LMP.Models.KnowledgeTesting;
using Newtonsoft.Json;

namespace LMP.Models
{
    public class User : ModelBase
    {
        public ICollection<Concept> Concept { get; set; }

        public string UserName { get; set; }

        public Membership Membership { get; set; }

        public bool? IsServiced { get; set; }

        public Student Student { get; set; }

        public Lecturer Lecturer { get; set; }

        public ICollection<ProjectUser> ProjectUsers { get; set; }

        public ICollection<ProjectComment> ProjectComments { get; set; }

        public ICollection<Project> Projects { get; set; }

        public ICollection<Bug> Bugs { get; set; }

        public ICollection<Bug> DeveloperBugs { get; set; }

        public ICollection<AnswerOnTestQuestion> UserAnswersOnTestQuestions { get; set; }

        public ICollection<TestPassResult> TestPassResults { get; set; }

        public ICollection<UserMessages> Messages { get; set; }

        public DateTime? LastLogin { get; set; }

        public string Attendance { get; set; }

        public string Avatar { get; set; }

        // TODO: maybe move to DbContext model config
        [NotMapped]
        public List<DateTime> AttendanceList
        {
            get
            {
                if (!string.IsNullOrEmpty(Attendance))
                    return (List<DateTime>) JsonConvert.DeserializeObject(Attendance, new List<DateTime>().GetType());

                return new List<DateTime>();
            }

            set => Attendance = JsonConvert.SerializeObject(value);
        }

        // TODO: maybe move to DbContext model config
        [NotMapped]
        public string FullName
        {
            get
            {
                if (Student != null)
                    return Student.FullName.Trim(' ');
                if (Lecturer != null) return Lecturer.FullName.Trim(' ');

                return UserName;
            }
        }

        public string SkypeContact { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        public string About { get; set; }
    }
}