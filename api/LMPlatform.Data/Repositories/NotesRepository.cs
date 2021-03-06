using Application.Core.Data;
using LMPlatform.Data.Infrastructure;
using LMPlatform.Data.Repositories.RepositoryContracts;
using LMPlatform.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMPlatform.Data.Repositories
{
    public class NotesRepository : RepositoryBase<LmPlatformModelsContext, Note>, INotesRepository
    {
        public NotesRepository(LmPlatformModelsContext dataContext) : base(dataContext)
        {
        }

        public List<Note> GetUserNotes(int userId)
        {
            
            using var context = new LmPlatformModelsContext();
            return context.Notes
                .Where(x => x.UserId == userId)
                .ToList();
        }

        public void SaveNote(Note note)
        {
            using var context = new LmPlatformModelsContext();
            if (note.Id != 0)
            {
                context.Update(note);
            }
            else
            {
                context.Add(note);
            }

            context.SaveChanges();
        }
    }
}
