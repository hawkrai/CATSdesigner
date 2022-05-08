using System.Collections.Generic;
using System.ServiceModel;
using System.ServiceModel.Web;
using LMPlatform.UI.Services.Modules;
using LMPlatform.UI.Services.Modules.Labs;

namespace LMPlatform.UI.Services.Labs
{
    using Modules.CoreModels;

    [ServiceContract]
    public interface ILabsService
    {
        // OK
        [OperationContract]
        [WebInvoke(UriTemplate = "/GetLabs/{subjectId}", RequestFormat = WebMessageFormat.Json, Method = "GET")]
        LabsResult GetLabs(string subjectId);

        // OK
		[OperationContract]
		[WebInvoke(UriTemplate = "/GetMarks?subjectId={subjectId}&groupId={groupId}", RequestFormat = WebMessageFormat.Json, Method = "GET")]
		StudentsMarksResult GetMarks(int subjectId, int groupId);

		// OK
		[OperationContract]
		[WebInvoke(UriTemplate = "/GetMarksV2?subjectId={subjectId}&groupId={groupId}", RequestFormat = WebMessageFormat.Json, Method = "GET")]
		StudentsMarksResult GetMarksV2(int subjectId, int groupId);

        // OK
        [OperationContract]
		[WebInvoke(UriTemplate = "/GetLabsV2?subjectId={subjectId}&groupId={groupId}", RequestFormat = WebMessageFormat.Json, Method = "GET")]
		LabsResult GetLabsV2(int subjectId, int groupId);

        [OperationContract]
        [WebInvoke(UriTemplate = "/GetSubGroups?subjectId={subjectId}&groupId={groupId}", RequestFormat = WebMessageFormat.Json, Method = "GET")]
        List<SubGroupViewData> GetSubGroups(int subjectId, int groupId);

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
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/SaveLabsVisitingData")]
        ResultViewData SaveLabsVisitingData(int dateId, List<string> marks, List<string> comments, List<int> studentsId, List<int> Id, List<StudentsViewData> students, List<bool> showForStudents);

        // OK
        [OperationContract]
		[WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/SaveLabsVisitingDataSingle")]
		ResultViewData SaveLabsVisitingDataSingle(int dateId, string mark, string comment, int studentsId, int id, bool showForStudent);

		// OK
        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/SaveStudentLabsMark")]
        ResultViewData SaveStudentLabsMark(int studentId, int labId, string mark, string comment, string date, int id, bool showForStudent);

        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/RemoveStudentLabsMark")]
        ResultViewData RemoveStudentLabsMark(int id);

        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/UpdateLabsOrder")]
        ResultViewData UpdateLabsOrder(int subjectId, int prevIndex, int curIndex);

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/GetMarksV3?subjectId={subjectId}&groupId={groupId}")]
        StudentsMarksResult GetMarksV3(int subjectId, int groupId);

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/GetUserLabFiles?userId={userId}&subjectId={subjectId}")]
        UserLabFilesResult GetUserLabFiles(int userId, int subjectId);

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/HasSubjectLabsJobProtection?subjectId={subjectId}&isActive={isActive}")]
        HasGroupsJobProtectionViewData HasSubjectLabsJobProtection(int subjectId, bool isActive);

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/GroupJobProtection?subjectId={subjectId}&groupId={groupId}")]
        GroupJobProtectionViewData GetGroupJobProtection(int subjectId, int groupId);

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json,
            UriTemplate = "/StudentJobProtection?subjectId={subjectId}&groupId={groupId}&studentId={studentId}")]
        StudentJobProtectionViewData GetStudentJobProtection(int subjectId, int groupId, int studentId);

    }
}
