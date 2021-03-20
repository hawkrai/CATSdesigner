using System.Collections.Generic;
using System.Collections.ObjectModel;
using Application.Core.Data;

namespace LMPlatform.Models
{
    public class Documents : ModelBase
    {
        public Documents()
        {
            Childrens = new Collection<Documents>();
            DocumentSubjects = new Collection<DocumentSubject>();
        }
        public string Name { get; set; }
        public string Text { get; set; }
        public int ParentOrder { get; set; }
        public int? UserId { get; set; }
        public int? ParentId { get; set; }
        public bool IsLocked { get; set; }
        public User User { get; set; }
        public Documents Parent { get; set; }
        public ICollection<Documents> Childrens { get; set; }
        public ICollection<DocumentSubject> DocumentSubjects { get; set; }
    }
}
