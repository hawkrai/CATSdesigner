using System.Linq;
using System.Text;
using System.Collections.Generic;
using Application.Core;
using Application.Infrastructure.DocumentsManagement;
using LMPlatform.UI.ViewModels.DocumentsViewModels;

namespace LMPlatform.UI.Services.Documents
{
    public class DocumentService : IDocumentService
    {
        private readonly LazyDependency<IDocumentManagementService> _documentManagementService = new LazyDependency<IDocumentManagementService>();

        public IDocumentManagementService DocumentManagementService => _documentManagementService.Value;

        public DocumentService() { }

        public DocumentPreview GetFullContent(int documentId, int userId)
        {
            var content = new StringBuilder();

            var document = DocumentManagementService.Find(documentId);

            if (document == null)
            {
                return new DocumentPreview();
            }

            ParseData(new List<Models.Documents>() { document }, ref content);

            void ParseData(IEnumerable<Models.Documents> documents, ref StringBuilder content)
            {
                foreach (var document in documents)
                {
                    var childrens = DocumentManagementService.GetByParentId(document.Id, userId);
                    if (!childrens.Any())
                    {
                        content.Append($"{document.Name}<br>{document.Text}");
                    }
                    else
                    {
                        content.Append($"{document.Name}<br>");
                        ParseData(childrens, ref content);
                    }
                }
            }

            document.Text = content.ToString();

            return DocumentToPreview(document);
        }

        public IEnumerable<DocumentPreview> GetDocumentsBySubjectId(int subjectId, int userId) 
        {
            var parentNodes = DocumentManagementService.GetBySubjectId(subjectId, userId);

            foreach (var document in parentNodes)
                yield return DocumentToPreview(document);
        }

        public IEnumerable<DocumentsTree> GetDocumentsTreeBySubjectId(int subjectId, int userId)
        {
            var documents = DocumentManagementService.GetBySubjectId(subjectId, userId).Where(x => x.ParentId == null);

            IEnumerable<DocumentsTree> ParseData(IEnumerable<Models.Documents> documents)
            {
                foreach (var document in documents)
                {
                    yield return new DocumentsTree()
                    {
                        Id = document.Id,
                        Name = document.Name,
                        IsLocked = document.IsLocked,
                        Children = ParseData(DocumentManagementService.GetByParentId(document.Id, userId))
                    };
                }
            }

            return ParseData(documents);
        }

        public int UpdateDocument(DocumentPreview document)
        {
            Models.Documents entity;

            var subjectId = document.SubjectId.HasValue ? document.SubjectId.Value : 0;
            var documentDTO = PreviewToDocument(document);

            if (documentDTO.Id == 0) //Save new document
            {
                entity = DocumentManagementService.SaveDocument(documentDTO, subjectId);
            }
            else // Update existing
            {
                var existingDocument = DocumentManagementService.Find(document.Id);

                // Переделать, вроде можно через маппер
                existingDocument.Name = documentDTO.Name;
                existingDocument.ParentId = documentDTO.ParentId;
                existingDocument.UserId = documentDTO.UserId;
                existingDocument.Text = documentDTO.Text;
                existingDocument.ParentOrder = documentDTO.ParentOrder;
                existingDocument.IsLocked = documentDTO.IsLocked;

                entity = DocumentManagementService.UpdateDocument(existingDocument);
            }

            return entity.Id;
        }

        public bool RemoveDocument(int documentId)
        {
            var document = DocumentManagementService.Find(documentId);

            if (document == null)
            {
                return false;
            }

            RemoveChilds(new List<Models.Documents>() { document });

            void RemoveChilds(IEnumerable<Models.Documents> documents)
            {
                foreach (var document in documents)
                {
                    if (DocumentManagementService.GetByParentId(document.Id).Any())
                    {
                        RemoveChilds(DocumentManagementService.GetByParentId(document.Id));
                    }
                    DocumentManagementService.RemoveDocument(document);
                }
            }

            return true;
        }

        DocumentPreview DocumentToPreview(Models.Documents document) => new DocumentPreview()
        {
            Id = document.Id,
            UserId = document.UserId,
            ParentId = document.ParentId,
            Name = document.Name,
            Text = document.Text,
            ParentOrder = document.ParentOrder,
            IsLocked = document.IsLocked,
        };

        Models.Documents PreviewToDocument(DocumentPreview document) => new Models.Documents()
        {
            Id = document.Id,
            UserId = document.UserId,
            ParentId = document.ParentId,
            Name = document.Name,
            Text = document.Text,
            ParentOrder = document.ParentOrder,
            IsLocked = document.IsLocked,
        };
    }
}