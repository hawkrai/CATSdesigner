using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Drawing;
using Entities.Models.GroupChatModels;
#nullable disable

namespace Entities.Models.GroupChatModels
{
    public partial class SubjectLecturer
    {
        public int Id { get; set; }
        public int LecturerId { get; set; }
        public int SubjectId { get; set; }
        public int? Owner { get; set; }
        public Guid? Guid { get; set; }

        [ForeignKey("SubjectId")]
        public Subject Subjects { get; set; }
    }
}
