using System.Collections.Generic;
using LMP.Models.From_App_Core_Data;

namespace LMP.Models.From_LMP_Models
{
    public class SubjectModule : ModelBase
    {
        public int SubjectId { get; set; }

        public int ModuleId { get; set; }

        public Subject Subject { get; set; }

        public Module Module { get; set; }

        public bool IsVisible { get; set; }

        public virtual ICollection<Folders> Folders { get; set; }
    }
}