using System.ServiceModel;
using System.ServiceModel.Web;
using LMPlatform.UI.Services.Modules.Parental;

namespace LMPlatform.UI.Services.Parental
{
	[ServiceContract]
	public interface IParentalService
	{
		[OperationContract]
		[WebInvoke(UriTemplate = "/GetGroupSubjectsByGroupName/{groupName}", RequestFormat = WebMessageFormat.Json, Method = "GET")]
		SubjectListResult GetGroupSubjectsByGroupName(string groupName);

        [OperationContract]
        [WebInvoke(UriTemplate = "/LoadGroup?groupId={groupId}&isArchive={isArchive}&startDate={startDate}&endDate={endDate}", RequestFormat = WebMessageFormat.Json, Method = "GET")]
        ParentalResult LoadGroup(string groupId, string isArchive, string startDate, string endDate);
		[OperationContract]
		[WebInvoke(UriTemplate = "/LoadStudent?isArchive={isArchive}&startDate={startDate}&endDate={endDate}", RequestFormat = WebMessageFormat.Json, Method = "GET")]
		ParentalResult LoadStudent(string isArchive, string startDate, string endDate);
	}
}