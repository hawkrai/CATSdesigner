using Application.Core;
using Application.Core.Data;
using Application.Core.Helpers;
using Application.Infrastructure.CPManagement;
using LMPlatform.Models.CP;
using LMPlatform.UI.Attributes;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;

namespace LMPlatform.UI.ApiControllers.CP
{
    [JwtAuth]
    public class CpTaskSheetTemplateController : ApiController
    {
        private readonly LazyDependency<ICPManagementService> _courseProjectManagementService =
            new LazyDependency<ICPManagementService>();

        private ICPManagementService CpManagementService
            => _courseProjectManagementService.Value;

        public CourseProjectTaskSheetTemplate Get(int templateId)
        {
            return CpManagementService.GetTaskSheetTemplate(templateId);
        }

        public PagedList<CourseProjectTaskSheetTemplate> Get([ModelBinder] GetPagedListParams parms)
        {
            return CpManagementService.GetTaskSheetTemplates(parms);
        }

        public void Post([FromBody] CourseProjectTaskSheetTemplate template)
        {
            template.LecturerId = UserContext.CurrentUserId;
            CpManagementService.SaveTaskSheetTemplate(template);
        }

        [HttpPost]
        public async Task<HttpResponseMessage> DeleteTaskSheetTemplate(int taskSheetId, int userId)
        {
            await CpManagementService.DeleteTaskSheetTemplate(taskSheetId, userId);

            return Request.CreateResponse(HttpStatusCode.OK);
        }

    }
}
