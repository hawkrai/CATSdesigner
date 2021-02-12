using LMPlatform.UI.ViewModels.DocumentsViewModels;
using System.Collections.Generic;
using System.ServiceModel;
using System.ServiceModel.Web;

namespace LMPlatform.UI.Services.Documents
{
    [ServiceContract]
    public interface IDocumentService
    {
        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/GetDocumentsBySubjectId?subjectId={subjectId}")]
        IEnumerable<DocumentPreview> GetDocumentsBySubjectId(int subjectId);

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/GetDocumentsTreeBySubjectId?subjectId={subjectId}")]
        IEnumerable<DocumentsTree> GetDocumentsTreeBySubjectId(int subjectId);

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/GetFullContent?documentId={documentId}")]
        DocumentPreview GetFullContent(int documentId);

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/RemoveDocument?documentId={documentId}")]
        bool RemoveDocument(int documentId);

        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/UpdateDocument")]
        int UpdateDocument(DocumentPreview document);
    }
}