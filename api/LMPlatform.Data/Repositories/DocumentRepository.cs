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
            //using (var context = new LmPlatformModelsContext())
            //{
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
            //}
        }
    }
}
