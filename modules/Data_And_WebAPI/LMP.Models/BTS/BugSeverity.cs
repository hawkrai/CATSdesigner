using System.Collections.Generic;
using Application.Core.Data;

namespace LMP.Models.BTS
{
    public class BugSeverity : ModelBase
    {
        public string Name { get; set; }

        public ICollection<Bug> Bug { get; set; }
    }
}