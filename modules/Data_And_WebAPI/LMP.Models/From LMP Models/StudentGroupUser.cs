using System.Collections.Generic;
using LMP.Models.From_App_Core_Data;

namespace LMP.Models.From_LMP_Models
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