using System.Collections.Generic;
using LMP.Models.From_App_Core_Data;

namespace LMP.Models.From_LMP_Models
{
    public class SubjectGroup : ModelBase
    {
        public int GroupId { get; set; }

        public int SubjectId { get; set; }

        public Group Group { get; set; }

        public Subject Subject { get; set; }

        public bool IsActiveOnCurrentGroup { get; set; }

        public ICollection<SubGroup> SubGroups { get; set; }

        public ICollection<SubjectStudent> SubjectStudents { get; set; }
    }
}