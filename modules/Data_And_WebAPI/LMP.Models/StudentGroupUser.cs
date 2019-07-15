using System.Collections.Generic;
using LMP.Models.Interface;

namespace LMP.Models
{
    public class StudentGroupUser : ModelBase
    {
        public int Number { get; set; }

        public string Name { get; set; }

        public int QuentityOfProjects { get; set; }

        public List<string> ProjectCreatorName { get; set; }

        public List<string> ProjectName { get; set; }

        public List<string> ProjectRole { get; set; }
    }
}