using System;
using LMP.Models.From_App_Core_Data;

namespace LMP.Models.From_LMP_Models.KnowledgeTesting
{
    public class AnswerOnTestQuestion : ModelBase
    {
        public int Number { get; set; }

        public int TestId { get; set; }

        public int UserId { get; set; }

        public int QuestionId { get; set; }

        public int Points { get; set; }

        public bool TestEnded { get; set; }

        public string AnswerString { get; set; }

        public DateTime? Time { get; set; }

        public User User { get; set; }
    }
}