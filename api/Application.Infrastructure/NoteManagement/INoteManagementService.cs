using LMPlatform.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Infrastructure.NoteManagement
{
    public interface INoteManagementService
    {

        public void SaveNote(Note note);

        public List<Note> GetUserNotes(int userId);

        public void DeleteNote(int noteId);

        public List<UserNote> GetPersonalNotes(int userId);

        public bool CheckIfAllowed(int userId, DateTime date, TimeSpan startTime, TimeSpan endTime, int? excludeNoteId = null);

        public UserNote SavePersonalNote(UserNote note);

        public void DeletePersonalNote(int noteId);
    }
}
