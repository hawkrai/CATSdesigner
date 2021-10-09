using System;
using System.Collections.Generic;

#nullable disable

namespace Entities.Models
{
    public partial class SubjectGroup
    {
        public int Id { get; set; }
        public int GroupId { get; set; }
        public int SubjectId { get; set; }
        public bool? IsActiveOnCurrentGroup { get; set; }
        public Guid? Guid { get; set; }
    }
}
