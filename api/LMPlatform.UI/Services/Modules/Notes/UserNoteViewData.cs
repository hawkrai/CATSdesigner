using LMPlatform.Models;
using System.Runtime.Serialization;

namespace LMPlatform.UI.Services.Modules.Notes
{
    [DataContract]
    public class UserNoteViewData
    {
        public UserNoteViewData(UserNote note)
        {
            Text = note.Text;
            UserId = note.UserId;
            Id = note.Id;
            StartTime = note.StartTime.ToString(@"hh\:mm");
            Date = note.Date.ToString("dd/MM/yyyy");
            EndTime = note.EndTime.ToString(@"hh\:mm");
        }
        [DataMember]
        public string Text { get; set; }

        [DataMember]
        public int UserId { get; set; }

        [DataMember]
        public string Date { get; set; }

        [DataMember]
        public string EndTime { get; set; }
        [DataMember]
        public string StartTime { get; set; }

        [DataMember]
        public int Id { get; set; }

    }
}