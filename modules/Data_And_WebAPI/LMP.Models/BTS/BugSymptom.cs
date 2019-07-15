using System.Collections.Generic;
using System.ComponentModel;
using LMP.Models.Interface;

namespace LMP.Models.BTS
{
    public class BugSymptom : ModelBase
    {
        //PROBLEM
        [DisplayName("Симптом")] public string Name { get; set; }

        public ICollection<Bug> Bug { get; set; }
    }
}