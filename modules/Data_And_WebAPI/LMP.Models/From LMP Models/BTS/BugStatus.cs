using System.Collections.Generic;
using System.ComponentModel;
using LMP.Models.From_App_Core_Data;

namespace LMP.Models.From_LMP_Models.BTS
{
    public class BugStatus : ModelBase
    {
        //PROBLEM
        [DisplayName("Статус")] public string Name { get; set; }

        public ICollection<Bug> Bug { get; set; }
    }
}