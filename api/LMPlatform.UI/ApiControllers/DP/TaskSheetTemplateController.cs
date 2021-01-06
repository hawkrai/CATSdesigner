using System.Web.Http;
using Application.Core;
using Application.Core.Helpers;
using Application.Infrastructure.DPManagement;
using LMPlatform.Models.DP;
using LMPlatform.UI.Attributes;
using WebMatrix.WebData;

namespace LMPlatform.UI.ApiControllers.DP
{
    [JwtAuth]
    public class TaskSheetTemplateController : ApiController
    {
        public DiplomProjectTaskSheetTemplate Get(int templateId)
        {
            return DpManagementService.GetTaskSheetTemplate(templateId);
        }

        public void Post([FromBody] DiplomProjectTaskSheetTemplate template)
        {
            template.LecturerId = UserContext.CurrentUserId;
            DpManagementService.SaveTaskSheetTemplate(template);
        }

        private IDpManagementService DpManagementService
        {
            get { return diplomProjectManagementService.Value; }
        }

        private readonly LazyDependency<IDpManagementService> diplomProjectManagementService = new LazyDependency<IDpManagementService>();
    }
}
