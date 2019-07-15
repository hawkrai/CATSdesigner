using System.Collections.Generic;
using System.ComponentModel;
using LMP.Models.From_App_Core_Data;

namespace LMP.Models.From_LMP_Models.BTS
{
    public class BugSeverity : ModelBase
    {
        //PROBLEM
        [DisplayName("Важность")] public string Name { get; set; }

        public ICollection<Bug> Bug { get; set; }
    }
}