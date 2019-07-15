using System.Collections.Generic;
using LMP.Models.Interface;

namespace LMP.Models
{
    public class Folders : ModelBase
    {
        public string Name { get; set; }

        public int Pid { get; set; }

        public int SubjectModuleId { get; set; }

        public SubjectModule SubjectModule { get; set; }

        public ICollection<Materials> Materials { get; set; }
    }
}