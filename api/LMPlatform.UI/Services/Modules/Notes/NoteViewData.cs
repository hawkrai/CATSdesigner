using LMPlatform.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace LMPlatform.UI.Services.Modules.Notes
{
    [DataContract]
    public class NoteViewData
    {
        public NoteViewData(Note note)
        {
            Id = note.Id;
            Text = note.Text;
            UserId = note.UserId;
            SubjectId = note.SubjectId;
        }
        [DataMember]
        public string Text { get; set; }

        [DataMember]
        public int UserId { get; set; }

        [DataMember]
        public int SubjectId { get; set; }

        [DataMember]
        public int Id { get; set; }

    }
}