using System.Net;
using System.Net.Http;
using System.Web.Http;
using Application.Core;
using Application.Core.Helpers;
using Application.Infrastructure.CPManagement;
using LMPlatform.UI.Attributes;

namespace LMPlatform.UI.ApiControllers.CP
{
    [JwtAuth]
    public class CourseStudentMarkController : ApiController
    {
        private readonly LazyDependency<ICPManagementService> _courseProjectManagementService = new LazyDependency<ICPManagementService>();

        private ICPManagementService CpManagementService
            => _courseProjectManagementService.Value;

        public HttpResponseMessage Post([FromBody] CourseStudentMarkModel courseStudentMarkModel)
        {
            CpManagementService.SetStudentCourseProjectMark(UserContext.CurrentUserId, courseStudentMarkModel);

            return new HttpResponseMessage(HttpStatusCode.OK);
        }
    }
}