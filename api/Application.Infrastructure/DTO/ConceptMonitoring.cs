using Application.Core.Data;
using LMPlatform.Models;
using System.Collections.Generic;

namespace Application.Infrastructure.DTO
{
    public class ConceptMonitoring : ModelBase
    {
        public ConceptMonitoring()
        {
            Children = new List<ConceptMonitoring>();
        }

        public string Name { get; set; }

        public virtual int? ParentId { get; set; }
        public virtual int? Estimated { get; set; }
        public virtual int? WatchingTime { get; set; }

        public virtual List<ConceptMonitoring> Children { get; set; }

        public string Container { get; set; }

        public bool IsGroup { get; set; }

        public virtual string SubjectName { get; set; }

        public List<ConceptMonitoring> GetAllChildren()
        {
            var list = new List<ConceptMonitoring>();
            if (Children != null)
            {
                foreach (var child in Children) list.AddRange(child.GetAllChildren());
                list.AddRange(Children);
            }

            return list;
        }

        public static ConceptMonitoring FromConcept(Concept concept)
        {
            return new ConceptMonitoring()
            {
                Name = concept.Name,
                ParentId = concept.ParentId,
                Container = concept.Container,
                IsGroup = concept.IsGroup,
                SubjectName = concept.Subject?.Name
            };
        }
    }
}
