using Application.Core.Data;

using LMPlatform.Data.Repositories;
using LMPlatform.Models;

using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace Application.Infrastructure.DocumentsManagement
{
    public class DocumentManagementService : IDocumentManagementService
    {
        public IEnumerable<Documents> GetAll()
        {
            using var repositoriesContainer = new LmPlatformRepositoriesContainer();
            var documents = repositoriesContainer.DocumentRepository.GetAll()
                .Include(x => x.DocumentSubjects)
                .Include(x => x.User)
                .Include(x => x.Parent)
                .Include(x => x.Childrens);
            return documents.ToList();
        }
        public IEnumerable<Documents> GetBySubjectId(int subjectId)
        {
            using var repositoriesContainer = new LmPlatformRepositoriesContainer();
            var documents = repositoriesContainer.DocumentRepository.GetAll()
                .Include(x => x.DocumentSubjects)
                .Include(x => x.User)
                .Include(x => x.Parent)
                .Include(x => x.Childrens)
                .SelectMany(d => d.DocumentSubjects)
                .Where(x => x.SubjectId == subjectId)
                .Select(x => x.Document);
            return documents.ToList();
        }

        public IEnumerable<Documents> GetByParentId(int parentId)
        {
            using var repositoriesContainer = new LmPlatformRepositoriesContainer();
            var documents = repositoriesContainer.DocumentRepository.GetAll()
                .Where(x => x.ParentId == parentId);
            return documents.ToList();
        }

        public IEnumerable<Documents> GetByUserId(int userId)
        {
            using var repositoriesContainer = new LmPlatformRepositoriesContainer();
            var documents = repositoriesContainer.DocumentRepository.GetAll(new Query<Documents>(d => d.UserId == userId));
            return documents.ToList();
        }
        public Documents UpdateDocument(Documents document)
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                repositoriesContainer.DocumentRepository.Save(document);
                repositoriesContainer.ApplyChanges();
            }
            return document;
        }
        public Documents SaveDocument(Documents document, int subjectId)
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                repositoriesContainer.DocumentRepository.SaveDocument(document, subjectId);
                repositoriesContainer.ApplyChanges();
            }
            return document;
        }
        public bool RemoveDocument(Documents document)
        {
            using var repositoriesContainer = new LmPlatformRepositoriesContainer();
            
            if (document != null)
            {
                repositoriesContainer.DocumentRepository.Delete(document);
                repositoriesContainer.ApplyChanges();
                return true;
            }
            else
            {
                return false;
            }   
        }

        public Documents Find(int id)
        {
            using var repositoriesContainer = new LmPlatformRepositoriesContainer();
            return repositoriesContainer.DocumentRepository.GetBy(new Query<Documents>(d => d.Id == id));
        }
    }
}
