using System.Collections.Generic;
using Application.Core.Data;
using LMP.Models.KnowledgeTesting;

namespace LMP.Models
{
    public class ConceptQuestions : ModelBase
    {
        public int Id { get; set; }
        public int ConceptId { get; set; }
        public int QuestionId { get; set; }

        public Concept Concept { get; set; }

        public Question Question { get; set; }
    }

    public class Concept : ModelBase
    {
        public Concept()
        {
        }

        public Concept(string name, User author, Subject subject, bool isGroup, bool published)
        {
            Name = name;
            Author = author;
            Subject = subject;
            IsGroup = isGroup;
            Published = published;
            UserId = author.Id;
            SubjectId = subject.Id;
        }

        public ICollection<ConceptQuestions> ConceptQuestions { get; set; }

        public string Name { get; set; }

        public string Container { get; set; }

        public Concept Parent { get; set; }

        public int? ParentId { get; set; }

        public ICollection<Concept> Children { get; set; }

        public bool IsGroup { get; set; }

        public bool ReadOnly { get; set; }

        public int? NextConcept { get; set; }

        public int? PrevConcept { get; set; }

        public User Author { get; set; }

        public Subject Subject { get; set; }

        public bool Published { get; set; }

        public int SubjectId { get; set; }

        public int UserId { get; set; }

        public int? LectureId { get; set; }

        public int? PracticalId { get; set; }

        public int? LabId { get; set; }

        public List<Concept> GetAllChildren()
        {
            var list = new List<Concept>();
            if (Children != null)
            {
                foreach (var child in Children) list.AddRange(child.GetAllChildren());
                list.AddRange(Children);
            }

            return list;
        }
    }
}