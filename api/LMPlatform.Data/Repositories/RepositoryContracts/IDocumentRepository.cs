using Application.Core.Data;
using LMPlatform.Models;

namespace LMPlatform.Data.Repositories.RepositoryContracts
{
    public interface IDocumentRepository : IRepositoryBase<Documents>
    {
        bool SaveDocument(Documents document, int subjectId);

        bool CopyDocumentToSubject(int documentId, int subjectId);

        bool RemoveDocument(Documents document);
    }
}
