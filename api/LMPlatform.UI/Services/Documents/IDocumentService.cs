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
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/GetDocumentsBySubjectId?subjectId={subjectId}&userId={userId}")]
        IEnumerable<DocumentPreview> GetDocumentsBySubjectId(int subjectId, int userId);

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/GetDocumentsTreeBySubjectId?subjectId={subjectId}&userId={userId}")]
        IEnumerable<DocumentsTree> GetDocumentsTreeBySubjectId(int subjectId, int userId);

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/GetFullContent?documentId={documentId}&userId={userId}")]
        DocumentPreview GetFullContent(int documentId, int userId);

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/RemoveDocument?documentId={documentId}")]
        bool RemoveDocument(int documentId);

        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/UpdateDocument")]
        int UpdateDocument(DocumentPreview document);
    }
}