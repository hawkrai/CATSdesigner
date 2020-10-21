﻿using Application.Core;
using Application.Infrastructure.DocumentsManagement;
using Bootstrap;
using LMPlatform.UI.ViewModels.DocumentsViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace LMPlatform.UI.Services.Documents
{
    public class DocumentService : IDocumentService
    {
        private readonly LazyDependency<IDocumentManagementService> _documentManagementService = new LazyDependency<IDocumentManagementService>();

        public IDocumentManagementService DocumentManagementService => _documentManagementService.Value;

        public DocumentService() { }

        public DocumentPreview GetFullContent(int documentId)
        {
            var content = new StringBuilder();

            var document = DocumentManagementService.GetAll().FirstOrDefault(d => d.Id == documentId);

            if (document == null)
            {
                return new DocumentPreview();
            }

            ParseData(new List<Models.Documents>() { document }, ref content);

            void ParseData(IEnumerable<Models.Documents> documents, ref StringBuilder content)
            {
                foreach (var document in documents)
                {
                    var childrens = DocumentManagementService.GetByParentId(document.Id);
                    if (!childrens.Any())
                    {
                        content.Append(document.Text);
                    }
                    else
                    {
                        ParseData(childrens, ref content);
                    }
                }
            }

            document.Text = content.ToString();

            return DocumentToPreview(document);
        }

        public IEnumerable<DocumentPreview> GetDocumentsBySubjectId(int subjectId) // Надо убрать
        {
            var parentNodes = DocumentManagementService.GetBySubjectId(subjectId);

            foreach (var document in parentNodes)
                yield return DocumentToPreview(document);
        }

        public IEnumerable<DocumentsTree> GetDocumentsTreeBySubjectId(int subjectId)
        {
            var documents = DocumentManagementService.GetBySubjectId(subjectId).Where(x => x.ParentId == null);

            return documents.Select(book => new DocumentsTree()
            {
                Id = book.Id,
                Name = book.Name,
                Children = DocumentManagementService.GetByParentId(book.Id).Select(section => new DocumentsTree()//book.Childrens
                {
                    Id = section.Id,
                    Name = section.Name,
                    Children = DocumentManagementService.GetByParentId(section.Id).Select(subsection => new DocumentsTree()//section.Childrens
                    {
                        Id = subsection.Id,
                        Name = subsection.Name,
                        Children = DocumentManagementService.GetByParentId(subsection.Id).Select(paragraph => new DocumentsTree()//subsection.Childrens
                        {
                            Id = paragraph.Id,
                            Name = paragraph.Name
                        })
                    })
                })
            });
        }

        public bool UpdateDocument(DocumentPreview document)
        {
            var documentDTO = PreviewToDocument(document);

            if (documentDTO.Id == 0) //Save new document
            {
                DocumentManagementService.UpdateDocument(documentDTO);
            }
            else // Update existing
            {
                var existingDocument = DocumentManagementService.Find(document.Id);

                // Переделать, вроде можно через маппер
                existingDocument.Name = documentDTO.Name;
                existingDocument.ParentId = documentDTO.ParentId;
                existingDocument.UserId = documentDTO.UserId;
                existingDocument.Description = documentDTO.Description;
                existingDocument.Text = documentDTO.Text;
                existingDocument.ParentOrder = documentDTO.ParentOrder;

                DocumentManagementService.UpdateDocument(existingDocument);
            }

            return true;
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
                    if (document.Childrens.Any())
                    {
                        RemoveChilds(document.Childrens);
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
            Description = document.Description,
            Text = document.Text,
            ParentOrder = document.ParentOrder
        };

        Models.Documents PreviewToDocument(DocumentPreview document) => new Models.Documents()
        {
            Id = document.Id,
            UserId = document.UserId,
            ParentId = document.ParentId,
            Name = document.Name,
            Description = document.Description,
            Text = document.Text,
            ParentOrder = document.ParentOrder
        };
    }
}