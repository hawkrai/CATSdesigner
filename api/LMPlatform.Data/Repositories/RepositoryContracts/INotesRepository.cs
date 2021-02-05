using Application.Core.Data;
using LMPlatform.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMPlatform.Data.Repositories.RepositoryContracts
{
    public interface INotesRepository : IRepositoryBase<Note>
    {
		public void SaveNote(Note note);
		public List<Note> GetUserNotes(int userId);

	}
}
