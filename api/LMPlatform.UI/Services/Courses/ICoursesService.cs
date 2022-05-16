using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using LMPlatform.UI.Services.Modules.CoreModels;
using LMPlatform.UI.Services.Modules.Labs;

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
        [WebInvoke(UriTemplate = "/GetFilesV2?subjectId={subjectId}&groupId={groupId}&IsCp={isCp}", RequestFormat = WebMessageFormat.Json, Method = "GET")]
        StudentsMarksResult GetFilesV2(int subjectId, int groupId);
    }
}
