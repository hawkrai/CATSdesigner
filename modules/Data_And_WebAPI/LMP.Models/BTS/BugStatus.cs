using System.Collections.Generic;
using Application.Core.Data;

namespace LMP.Models.BTS
{
    public class BugStatus : ModelBase
    {
        public string Name { get; set; }

        public ICollection<Bug> Bug { get; set; }
    }
}