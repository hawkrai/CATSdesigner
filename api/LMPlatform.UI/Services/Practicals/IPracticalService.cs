using System.Collections.Generic;
using System.ServiceModel;
using System.ServiceModel.Web;
using LMPlatform.UI.Services.Modules;
using LMPlatform.UI.Services.Modules.CoreModels;
using LMPlatform.UI.Services.Modules.Practicals;

namespace LMPlatform.UI.Services.Practicals
{
    [ServiceContract]
    public interface IPracticalService
    {
        // OK
        [OperationContract]
        [WebInvoke(UriTemplate = "/GetPracticals/{subjectId}", RequestFormat = WebMessageFormat.Json, Method = "GET")]
        PracticalsResult GetLabs(string subjectId);

        // OK
        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/Save")]
        ResultViewData Save(int subjectId, int id, string theme, int duration, int order, string shortName, string pathFile, string attachments);

        // OK
        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/Delete")]
        ResultViewData Delete(int id, int subjectId);

        // OK
        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/SaveScheduleProtectionDate")]
        ResultViewData SaveScheduleProtectionDate(int groupId, string date, int subjectId);

        // OK
        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/GetPracticalsVisitingData")]
        List<PracticalVisitingMarkViewData> GetPracticalsVisitingData(int subjectId, int groupId);

        // OK
        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/SavePracticalsVisitingData")]
        ResultViewData SavePracticalsVisitingData(List<StudentsViewData> students);

        // OK
        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/SaveStudentPracticalsMark")]
        ResultViewData SaveStudentPracticalsMark(int studentId, int practicalId, string mark, string comment,
            string date, int id);

        // OK
        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/DeleteVisitingDate")]
        ResultViewData DeleteVisitingDate(int id);
    }
}
