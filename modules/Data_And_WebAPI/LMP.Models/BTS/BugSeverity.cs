using System.Collections.Generic;
using System.ComponentModel;
using LMP.Models.Interface;

namespace LMP.Models.BTS
{
    public class BugSeverity : ModelBase
    {
        //PROBLEM
        [DisplayName("Важность")] public string Name { get; set; }

        public ICollection<Bug> Bug { get; set; }
    }
}