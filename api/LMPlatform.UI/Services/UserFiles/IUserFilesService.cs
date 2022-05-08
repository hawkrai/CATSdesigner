using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using LMPlatform.UI.Services.Modules;
using LMPlatform.UI.Services.Modules.Labs;

namespace LMPlatform.UI.Services.UserFiles
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IUserFilesService" in both code and config file together.
    [ServiceContract]
    public interface IUserFilesService
    {
        // OK
        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/SendFile")]
        UserLabFileViewData SendFile(int subjectId, int userId, int id, string comments, string pathFile, string attachments, bool isCp, bool isRet, int? labId = null, int? practicalId = null);

        // OK
        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/DeleteUserFile")]
        ResultViewData DeleteUserFile(int id);

        // OK
        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/ReceivedFile")]
        ResultViewData ReceivedFile(int userFileId);

        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/ReturnFile")]
        ResultViewData ReturnFile(int userFileId);

        // OK
        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/CancelReceivedFile")]
        ResultViewData CancelReceivedFile(int userFileId);

        // OK
        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/CheckPlagiarism")]
        ResultViewData CheckPlagiarism(int userFileId, int subjectId, bool isCp = false, bool isLab = false, bool isPractical = false);

        // OK
        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/CheckPlagiarismSubjects")]
        ResultPSubjectViewData CheckPlagiarismSubjects(string subjectId, int type, int threshold, bool isCp = false, bool isLab = false, bool isPractical = false);
    }
}
