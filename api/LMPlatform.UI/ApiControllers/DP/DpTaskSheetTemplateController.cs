using System.Web.Http;
using System.Web.Http.ModelBinding;
using Application.Core;
using Application.Core.Data;
using Application.Core.Helpers;
using Application.Infrastructure.DPManagement;
using LMPlatform.Models.DP;
using LMPlatform.UI.Attributes;
using WebMatrix.WebData;

namespace LMPlatform.UI.ApiControllers.DP
{
    [JwtAuth]
    public class DpTaskSheetTemplateController : ApiController
    {
        public DiplomProjectTaskSheetTemplate Get(int templateId)
        {
            return DpManagementService.GetTaskSheetTemplate(templateId);
        }

        public PagedList<DiplomProjectTaskSheetTemplate> Get([ModelBinder] GetPagedListParams parms)
        {
            return DpManagementService.GetTaskSheetTemplates(parms);
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
