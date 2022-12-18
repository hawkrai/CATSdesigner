using System.Web.Http;
using System.Web.Http.ModelBinding;
using Application.Core;
using Application.Core.Data;
using Application.Core.Helpers;
using Application.Infrastructure.CPManagement;
using LMPlatform.Models.CP;
using LMPlatform.UI.Attributes;

namespace LMPlatform.UI.ApiControllers.CP
{
    [JwtAuth]
    public class CpTaskSheetTemplateController : ApiController
    {
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

        private ICPManagementService CpManagementService
        {
            get { return courseProjectManagementService.Value; }
        }

        private readonly LazyDependency<ICPManagementService> courseProjectManagementService = new LazyDependency<ICPManagementService>();
    }
}
