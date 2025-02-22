using Entities.Models.GroupChatModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Entities.Models
{
    public class Group
    {
        [Key]
        public int Id { get; set; }

        public virtual bool IsNew => Id == 0;

        public string Name { get; set; }

        public string StartYear { get; set; }

        public string GraduationYear { get; set; }

        public ICollection<Student> Students { get; set; } = new HashSet<Student>();

        public ICollection<SubjectGroup> SubjectGroups { get; set; } = new HashSet<SubjectGroup>();

        public ICollection<GroupChat> GroupChats { get; set; } = new HashSet<GroupChat>();
    }
}
