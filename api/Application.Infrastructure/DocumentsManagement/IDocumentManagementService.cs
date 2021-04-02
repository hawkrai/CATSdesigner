using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LMPlatform.Models;

namespace Application.Infrastructure.DocumentsManagement
{
    public interface IDocumentManagementService
    {
        IEnumerable<Documents> GetAll();
        IEnumerable<Documents> GetBySubjectId(int subjectId, int userId);
        IEnumerable<Documents> GetByParentId(int parentId, int userId);
        IEnumerable<Documents> GetByParentId(int parentId);
        IEnumerable<Documents> GetByUserId(int userId);
        Documents Find(int id);
        Documents UpdateDocument(Documents document);
        Documents SaveDocument(Documents document, int subjectId);
        bool RemoveDocument(Documents document);
    }
}
