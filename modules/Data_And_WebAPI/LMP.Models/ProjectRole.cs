using System.Collections.Generic;
using System.ComponentModel;
using LMP.Models.Interface;

namespace LMP.Models
{
    public class ProjectRole : ModelBase
    {
        public const int Developer = 1;
        public const int Tester = 2;
        public const int Leader = 3;

        public string Name { get; set; }

        public ICollection<ProjectUser> ProjectUser { get; set; }
    }
}