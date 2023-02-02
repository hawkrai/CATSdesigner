using LMPlatform.UI.Services.Modules.CoreModels;
using LMPlatform.UI.Services.Modules.Labs;
using System.ServiceModel;
using System.ServiceModel.Web;

namespace LMPlatform.UI.Services.Courses
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "ICoursesService" in both code and config file together.
    [ServiceContract]
    public interface ICoursesService
    {
        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/GetFiles")]
        UserLabFilesResult GetFiles(int userId, int subjectId);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "/GetFilesV2?subjectId={subjectId}&groupId={groupId}&IsCp={isCp}", RequestFormat = WebMessageFormat.Json)]
        StudentsMarksResult GetFilesV2(int subjectId, int groupId, bool isCp);
    }
}
