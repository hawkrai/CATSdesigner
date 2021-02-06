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
            Text = note.Text;
            Date = note.Date.ToString("dd/MM/yyyy");
            Time = note.Time.ToString(@"hh\:mm");
            UserId = note.UserId;
            SubjectId = note.SubjectId;
        }
        [DataMember]
        public string Text { get; set; }

        [DataMember]
        public string Date { get; set; }

        [DataMember]
        public string Time { get; set; }

        [DataMember]
        public int UserId { get; set; }

        [DataMember]
        public int SubjectId { get; set; }

    }
}