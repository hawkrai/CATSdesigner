using System.Net;
using System.Net.Http;
using System.Web.Http;
using Application.Core;
using Application.Infrastructure.CPManagement;
using WebMatrix.WebData;

namespace LMPlatform.UI.ApiControllers.CP
{
    public class CourseStudentMarkController : ApiController
    {
        public HttpResponseMessage Post([FromBody] CourseStudentMarkModel courseStudentMarkModel)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            CpManagementService.SetStudentDiplomMark(WebSecurity.CurrentUserId, courseStudentMarkModel);
            return new HttpResponseMessage(HttpStatusCode.OK);
        }

        private ICPManagementService CpManagementService
        {
            get { return _courseProjectManagementService.Value; }
        }

        private readonly LazyDependency<ICPManagementService> _courseProjectManagementService = new LazyDependency<ICPManagementService>();
    }
}