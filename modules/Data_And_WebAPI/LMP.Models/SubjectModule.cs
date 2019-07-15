using System.Collections.Generic;
using LMP.Models.Interface;

namespace LMP.Models
{
    public class SubjectModule : ModelBase
    {
        public int SubjectId { get; set; }

        public int ModuleId { get; set; }

        public Subject Subject { get; set; }

        public Module Module { get; set; }

        public bool IsVisible { get; set; }

        public ICollection<Folders> Folders { get; set; }
    }
}