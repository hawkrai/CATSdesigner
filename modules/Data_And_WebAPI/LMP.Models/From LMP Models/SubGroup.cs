using System.Collections.Generic;
using LMP.Models.From_App_Core_Data;

namespace LMP.Models.From_LMP_Models
{
    public class SubGroup : ModelBase
    {
        public string Name { get; set; }

        public int SubjectGroupId { get; set; }

        public SubjectGroup SubjectGroup { get; set; }

        public ICollection<SubjectStudent> SubjectStudents { get; set; }

        public ICollection<ScheduleProtectionLabs> ScheduleProtectionLabs { get; set; }
    }
}