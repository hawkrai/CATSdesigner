using System.Diagnostics.CodeAnalysis;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using Application.Core;
using Application.Core.Data;
using Application.Core.Helpers;
using Application.Infrastructure.CPManagement;
using Application.Infrastructure.CTO;
using LMPlatform.UI.Attributes;

namespace LMPlatform.UI.ApiControllers.CP
{
    [JwtAuth]
    public class CourseProjectController : ApiController
    {
        private readonly LazyDependency<ICPManagementService> _cpManagementService = new LazyDependency<ICPManagementService>();

        private ICPManagementService CpManagementService 
            => _cpManagementService.Value;

        public PagedList<CourseProjectData> Get([ModelBinder]GetPagedListParams parms)
        {
            return CpManagementService.GetProjects(UserContext.CurrentUserId, parms);
        }

        public CourseProjectData Get(int id)
        {
            return CpManagementService.GetProject(id);
        }

        public HttpResponseMessage Post([FromBody]CourseProjectData project)
        {
            return SaveProject(project);
        }

        public HttpResponseMessage Put([FromBody]CourseProjectData project)
        {
            return SaveProject(project);
        }

        public void Post(int id)
        {
            CpManagementService.DeleteProject(UserContext.CurrentUserId, id);
        }

        private HttpResponseMessage SaveProject(CourseProjectData project)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            project.LecturerId = UserContext.CurrentUserId;
            
            CpManagementService.SaveProject(project);

            return new HttpResponseMessage(HttpStatusCode.OK);
        }

    }
}