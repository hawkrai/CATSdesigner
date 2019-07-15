using System.Collections.Generic;
using System.ComponentModel;
using LMP.Models.From_App_Core_Data;

namespace LMP.Models.From_LMP_Models.BTS
{
    public class BugSymptom : ModelBase
    {
        //PROBLEM
        [DisplayName("Симптом")] public string Name { get; set; }

        public ICollection<Bug> Bug { get; set; }
    }
}