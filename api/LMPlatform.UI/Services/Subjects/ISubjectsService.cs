using System.Collections.Generic;
using System.ServiceModel;
using System.ServiceModel.Web;
using LMPlatform.UI.Services.Modules;
using LMPlatform.UI.Services.Modules.Parental;
using LMPlatform.UI.ViewModels.SubjectViewModels;


namespace LMPlatform.UI.Services.Subjects
{
    [ServiceContract]
    public interface ISubjectsService
    {
        [OperationContract]
        [WebInvoke(Method = "PATCH", UriTemplate = "/Subjects", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        SubjectResult Update(SubjectViewData subject);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "/List", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        SubjectsResult GetSubjectsBySession();

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "/Modules/{subjectId}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        IEnumerable<ModulesViewModel> GetSubjectModules(string subjectId);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "/ModulesForSchedule/{subjectId}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        IEnumerable<ModulesViewModel> GetSubjectModulesForSchedule(string subjectId);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "/Assigned/{subjectId}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        UserAssignedViewData UserAssigned(string subjectId);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "/GetSubjectOwner/{subjectId}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        LectorResult GetSubjectOwner(string subjectId);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "/GetUserSubjects", ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json)]
        SubjectsResult GetUserSubjects();

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/Name/Unique", ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json)]
        UniqueViewData IsSubjectNameUnique(string subjectName, int subjectId);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/Abbreviation/Unique", ResponseFormat = WebMessageFormat.Json,
            RequestFormat = WebMessageFormat.Json)]
        UniqueViewData IsSubjectAbbreviationUnique(string subjectAbbreviation, int subjectId);

    }
}
