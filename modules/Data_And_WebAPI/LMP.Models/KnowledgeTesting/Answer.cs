using System;
using Application.Core.Data;

namespace LMP.Models.KnowledgeTesting
{
    public class Answer : ModelBase, ICloneable
    {
        public int QuestionId { get; set; }

        public Question Question { get; set; }

        public string Content { get; set; }

        public int СorrectnessIndicator { get; set; }

        public object Clone()
        {
            return new Answer
            {
                Id = Id,
                Content = Content,
                СorrectnessIndicator = СorrectnessIndicator
            };
        }
    }
}