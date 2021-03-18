using Application.Core.Data;
using LMPlatform.Data.Repositories;
using LMPlatform.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Infrastructure.NoteManagement
{
    public class NoteManagementService : INoteManagementService
    {
        public List<Note> GetUserNotes(int userId)
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {

                return repositoriesContainer.NotesRepository.GetUserNotes(userId);
            }

        }

        public void SaveNote(Note note)
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {

                repositoriesContainer.NotesRepository.SaveNote(note);
            }
        }

        public void DeleteNote(int noteId)
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                var note = repositoriesContainer.NotesRepository.GetBy(new Query<Note>(x => x.Id == noteId));
                repositoriesContainer.NotesRepository.Delete(note);
                repositoriesContainer.ApplyChanges();
            }
        }

        public List<UserNote> GetPersonalNotes(int userId)
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {

                return repositoriesContainer.RepositoryFor<UserNote>().GetAll(new Query<UserNote>(x => x.UserId == userId)).ToList();
            }
        }

        public void SavePersonalNote(UserNote note)
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                repositoriesContainer.RepositoryFor<UserNote>().Save(note);
                repositoriesContainer.ApplyChanges();

            }
        }

        public void DeletePersonalNote(int noteId)
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                var repository = repositoriesContainer.RepositoryFor<UserNote>();
                var note = repository.GetBy(new Query<UserNote>(x => x.Id == noteId));
                repository.Delete(note);
                repositoriesContainer.ApplyChanges();
            }
        }
    }
}
