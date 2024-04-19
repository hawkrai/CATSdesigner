using Entities.Models.GroupChatModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

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

        [ForeignKey("SubjectId")]
        public Subject Subjects { get; set; }
    }
}
