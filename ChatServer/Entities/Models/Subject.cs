using Entities.Models.GroupChatModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Entities.Models
{
    public class Subject
    {
        [Key]
        public int Id { get; set; }

        public virtual bool IsNew
        {
            get
            {
                return Id == 0;
            }
        }

        public string Name { get; set; }

        public string ShortName { get; set; }

        public string Color { get; set; }

        public bool IsArchive { get; set; }

        public bool IsNeededCopyToBts { get; set; }

        public ICollection<SubjectGroup> SubjectGroups { get; set; }

        public ICollection<SubjectLecturer> SubjectLecturers { get; set; }
    }
}
