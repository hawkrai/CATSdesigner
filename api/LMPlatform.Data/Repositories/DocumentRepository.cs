using Application.Core.Data;
using LMPlatform.Data.Infrastructure;
using LMPlatform.Data.Repositories.RepositoryContracts;
using LMPlatform.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMPlatform.Data.Repositories
{
    public class DocumentRepository : RepositoryBase<LmPlatformModelsContext, Documents>, IDocumentRepository
    {
        public DocumentRepository(LmPlatformModelsContext dataContext)
            : base(dataContext)
        {
        }

        public bool SaveDocument(Documents document, int subjectId)
        {
            Documents result = null;
            if (document.Id == 0)// Add
            {
                result = DataContext.Set<Documents>().Add(document);
                DataContext.Set<DocumentSubject>().Add(new DocumentSubject() { DocumentId = result.Id, SubjectId = subjectId });
            }
            else // Update
            {
                DataContext.Set<Documents>().AddOrUpdate(document);
            }

            DataContext.SaveChanges();

            return !(result == null);
        }

        public bool RemoveDocument(Documents document)
        {
            Documents result = null;

            var documentSubject = DataContext.Set<DocumentSubject>().FirstOrDefault(x => x.DocumentId == document.Id);
            var documentEntity = DataContext.Set<Documents>().FirstOrDefault(x => x.Id == document.Id);

            if (documentSubject != null)
                DataContext.Set<DocumentSubject>().Remove(documentSubject);

            if (documentEntity != null)
                result = DataContext.Set<Documents>().Remove(documentEntity);

            return !(result == null);
        }
    }
}
