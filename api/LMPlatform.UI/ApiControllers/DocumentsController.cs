using Application.Core;
using Application.Infrastructure.DocumentsManagement;
using LMPlatform.UI.Services.Documents;
using LMPlatform.UI.ViewModels.DocumentsViewModels;
using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace LMPlatform.UI.ApiControllers
{
    public class DocumentController : ApiController
    {
        private readonly LazyDependency<IDocumentManagementService> _documentManagementService = new LazyDependency<IDocumentManagementService>();

        public IDocumentManagementService DocumentManagementService
        {
            get
            {
                return _documentManagementService.Value;
            }
        }

        [System.Web.Http.HttpPost]
        public JsonResult UpdateDocument([FromBody] DocumentPreview document)
        {
            var subjectId = document.SubjectId.HasValue ? document.SubjectId.Value : 0;
            var documentDTO = PreviewToDocument(document);

            if (documentDTO.Id == 0) //Save new document
            {
                DocumentManagementService.SaveDocument(documentDTO, subjectId);
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

                DocumentManagementService.UpdateDocument(existingDocument);
            }

            return new JsonResult() { Data = true };
        }

        [System.Web.Http.HttpGet]
        public JsonResult RemoveDocument(int documentId)
        {
            var document = DocumentManagementService.Find(documentId);

            if (document == null)
            {
                return new JsonResult() { Data = false };
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

            return new JsonResult() { Data = true };
        }

        DocumentPreview DocumentToPreview(Models.Documents document) => new DocumentPreview()
        {
            Id = document.Id,
            UserId = document.UserId,
            ParentId = document.ParentId,
            Name = document.Name,
            Text = document.Text,
            ParentOrder = document.ParentOrder
        };

        Models.Documents PreviewToDocument(DocumentPreview document) => new Models.Documents()
        {
            Id = document.Id,
            UserId = document.UserId,
            ParentId = document.ParentId,
            Name = document.Name,
            Text = document.Text,
            ParentOrder = document.ParentOrder
        };
    }
}