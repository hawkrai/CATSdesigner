using System.Net;
using System.Net.Http;
using System.Web.Http;
using Application.Core;
using Application.Core.Helpers;
using Application.Infrastructure.CPManagement;
using LMPlatform.UI.Attributes;
using WebMatrix.WebData;

namespace LMPlatform.UI.ApiControllers.CP
{
    [JwtAuth]
    public class CourseStudentMarkController : ApiController
    {
        public HttpResponseMessage Post([FromBody] CourseStudentMarkModel courseStudentMarkModel)
        {
            /*if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }*/

            CpManagementService.SetStudentCourseProjectMark(UserContext.CurrentUserId, courseStudentMarkModel);
            return new HttpResponseMessage(HttpStatusCode.OK);
        }

        private ICPManagementService CpManagementService
        {
            get { return _courseProjectManagementService.Value; }
        }

        private readonly LazyDependency<ICPManagementService> _courseProjectManagementService = new LazyDependency<ICPManagementService>();
    }
}