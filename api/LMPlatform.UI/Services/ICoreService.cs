using System.ServiceModel;
using LMPlatform.UI.Services.Modules;
using LMPlatform.UI.Services.Modules.CoreModels;
using LMPlatform.UI.Services.Modules.Lectures;
using System.ServiceModel.Web;

namespace LMPlatform.UI.Services
{
	[ServiceContract]
    public interface ICoreService
    {
		//
	    [OperationContract]
		[WebInvoke(UriTemplate = "/GetGroups?subjectId={subjectId}&groupId={groupId}", RequestFormat = WebMessageFormat.Json, Method = "GET")]
        GroupsResult GetGroups(string subjectId, string groupId);

		// OK
		[OperationContract]
        [WebInvoke(UriTemplate = "/GetOnlyGroups/{subjectId}", RequestFormat = WebMessageFormat.Json, Method = "GET")]
        GroupsResult GetOnlyGroups(string subjectId);

        //
        [OperationContract]
        [WebInvoke(UriTemplate = "/GetAllGroupsLite/", RequestFormat = WebMessageFormat.Json, Method = "GET")]
        GroupsResult GetAllGroupsLite();

		//
		[WebInvoke(UriTemplate = "/GetGroupsV2/{subjectId}", RequestFormat = WebMessageFormat.Json, Method = "GET")]
		GroupsResult GetGroupsV2(string subjectId);

		//
        [WebInvoke(UriTemplate = "/GetGroupsV3/{subjectId}", RequestFormat = WebMessageFormat.Json, Method = "GET")]
        GroupsResult GetGroupsV3(string subjectId);

	    [OperationContract]
	    [WebInvoke(UriTemplate = "/GetStudentsByGroupId/{groupId}", RequestFormat = WebMessageFormat.Json, Method = "GET")]
	    StudentsResult GetStudentsByGroupId(string groupId);

        [OperationContract]
        [WebInvoke(UriTemplate = "/GetStudentsByStudentGroupId/{subjectId}/{groupId}", RequestFormat = WebMessageFormat.Json, Method = "GET")]
        StudentsResult GetStudentsByStudentGroupId(string groupId, string subjectId);

        [OperationContract]
	    [WebInvoke(UriTemplate = "/ConfirmationStudent/{studentId}", RequestFormat = WebMessageFormat.Json, Method = "POST")]
	    StudentsResult СonfirmationStudent(string studentId);

		[OperationContract]
		[WebInvoke(UriTemplate = "/UnConfirmationStudent/{studentId}", RequestFormat = WebMessageFormat.Json, Method = "POST")]
		StudentsResult UnConfirmationStudent(string studentId);

		[OperationContract]
		[WebInvoke(UriTemplate = "/GetSubjectsByOwnerUser/", RequestFormat = WebMessageFormat.Json, Method = "GET")]
	    SubjectsResult GetSubjectsByOwnerUser();

		[OperationContract]
		[WebInvoke(UriTemplate = "/GetNoAdjointLectors/{subjectId}", RequestFormat = WebMessageFormat.Json, Method = "GET")]
		LectorsResult GetNoAdjointLectors(string subjectId);

		[OperationContract]
		[WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/JoinLector")]
	    ResultViewData JoinLector(int subjectId, int lectorId);

		[OperationContract]
		[WebInvoke(UriTemplate = "/GetJoinedLector/{subjectId}", RequestFormat = WebMessageFormat.Json, Method = "GET")]
	    LectorsResult GetJoinedLector(string subjectId);

	    [OperationContract]
		[WebInvoke(UriTemplate = "/DisjoinLector", RequestFormat = WebMessageFormat.Json, Method = "POST")]
	    ResultViewData DisjoinLector(int subjectId, int lectorId);

        //TODO: Find way to reemove /All
        [OperationContract]
        [WebInvoke(UriTemplate = "/GetLecturers/All", RequestFormat = WebMessageFormat.Json, Method = "GET")]
        LectorsResult GetLecturers();

		[OperationContract]
		[WebInvoke(UriTemplate = "/GetGroupsByUser/{userId}", RequestFormat = WebMessageFormat.Json, Method = "GET")]
		GroupsResult GetGroupsByUser(string userId);

		[OperationContract]
		[WebInvoke(UriTemplate = "/GetUserGroups", RequestFormat = WebMessageFormat.Json, Method = "GET")]
		GroupsResult GetUserGroups();

		[OperationContract]
		[WebInvoke(UriTemplate = "/GetGroupsByUserV2/{userId}", RequestFormat = WebMessageFormat.Json, Method = "GET")]
		GroupsResult GetGroupsByUserV2(string userId);

		[OperationContract]
		[WebInvoke(UriTemplate = "/GetLecturer/{userId}", RequestFormat = WebMessageFormat.Json, Method = "GET")]
		LectorResult GetLecturer(string userId);
		[OperationContract]
		[WebInvoke(UriTemplate = "/GetUserSubjectGroup?subjectId={subjectId}&userId={userId}", RequestFormat = WebMessageFormat.Json, Method = "GET")]
		GroupResult GetUserSubjectGroup(int subjectId, int userId);
			
	}
}
