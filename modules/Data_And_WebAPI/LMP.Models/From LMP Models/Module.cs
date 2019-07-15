using System.Collections.Generic;
using LMP.Models.From_App_Core_Data;

namespace LMP.Models.From_LMP_Models
{
    public class Module : ModelBase
    {
        public string Name { get; set; }

        public string DisplayName { get; set; }

        public bool Visible { get; set; }

        public ModuleType ModuleType { get; set; }

        public ICollection<SubjectModule> SubjectModules { get; set; }

        public int Order { get; set; }
    }
}