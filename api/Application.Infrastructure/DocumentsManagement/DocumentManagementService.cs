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
        private static readonly string[] AllowedRolesToModify = new string[] { "admin", "lector" };
        private static readonly string[] AdminRoles = new string[] { "admin" };

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
        public IEnumerable<Documents> GetBySubjectId(int subjectId, int userId)
        {
            using var repositoriesContainer = new LmPlatformRepositoriesContainer();
            var isUserHasPermissions = IsUserCanModifyDocuments(userId);
            var documents = repositoriesContainer.DocumentRepository.GetAll()
                .Include(x => x.DocumentSubjects)
                .Include(x => x.User)
                .Include(x => x.Parent)
                .Include(x => x.Childrens)
                .SelectMany(d => d.DocumentSubjects)
                .Where(x => x.SubjectId == subjectId && (!x.Document.IsLocked || x.Document.UserId == userId || isUserHasPermissions))
                .Select(x => x.Document);
            return documents.ToList();
        }

        public IEnumerable<Documents> GetByParentId(int parentId, int userId)
        {
            using var repositoriesContainer = new LmPlatformRepositoriesContainer();
            var isUserHasPermissions = IsUserCanModifyDocuments(userId);
            var documents = repositoriesContainer.DocumentRepository.GetAll()
                .Where(x => x.ParentId == parentId && (!x.IsLocked || x.UserId == userId || isUserHasPermissions));
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
        public bool CopyDocumentToSubject(int documentId, int subjectId)
        {
            bool result = false;
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                result = repositoriesContainer.DocumentRepository.CopyDocumentToSubject(documentId, subjectId);
                repositoriesContainer.ApplyChanges();
            }
            return result;
        }
        public bool RemoveDocument(Documents document)
        {
            using var repositoriesContainer = new LmPlatformRepositoriesContainer();
            
            if (document != null)
            {
                repositoriesContainer.DocumentRepository.RemoveDocument(document);
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

        public IEnumerable<Documents> GetEnabledByUserId(int userId, int currentSubjectId)
        {
            using var repositoriesContainer = new LmPlatformRepositoriesContainer();
            var user = repositoriesContainer.UsersRepository.GetBy(new Query<User>(u => u.Id == userId).Include(u => u.Membership.Roles));

            if (user.Membership.Roles.Any(r => AllowedRolesToModify.Contains(r.RoleName))) {
                var parentNodes = repositoriesContainer.DocumentRepository
                    .GetAll(new Query<Documents>(x => x.Parent == null)
                    .Include(x => x.DocumentSubjects)).ToArray();

                var userSubjectIds = repositoriesContainer.SubjectRepository
                    .GetAll(new Query<Subject>(s => s.SubjectLecturers.Any(sl => sl.Lecturer.User.Id == userId)))
                    .Select(s => s.Id)
                    .Where(s => s != currentSubjectId).ToArray();

                var currentSubjectBooks = parentNodes
                    .Where(x => x.DocumentSubjects.Any(x => x.SubjectId == currentSubjectId));

                return parentNodes
                    .Where(d => d.DocumentSubjects.Any(ds => userSubjectIds.Contains(ds.SubjectId)))
                    .Except(currentSubjectBooks)
                    .ToList();
            }
            else
            {
                return new List<Documents>();
            }
        }

        private bool IsUserCanModifyDocuments(int userId)
        {
            using var repositoriesContainer = new LmPlatformRepositoriesContainer();
            var user = repositoriesContainer.UsersRepository
                .GetBy(new Query<User>(u => u.Id == userId)
                .Include(u => u.Membership.Roles));

            return user.Membership.Roles.Any(r => AllowedRolesToModify.Contains(r.RoleName));
        }
    }
}
