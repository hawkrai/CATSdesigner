using System.Web.Http;
using System.Web.Http.ModelBinding;
using Application.Core;
using Application.Core.Data;
using Application.Infrastructure.CPManagement;
using LMPlatform.Models.CP;
using WebMatrix.WebData;

namespace LMPlatform.UI.ApiControllers.CP
{
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
            template.LecturerId = WebSecurity.CurrentUserId;
            CpManagementService.SaveTaskSheetTemplate(template);
        }

        private ICPManagementService CpManagementService
        {
            get { return courseProjectManagementService.Value; }
        }

        private readonly LazyDependency<ICPManagementService> courseProjectManagementService = new LazyDependency<ICPManagementService>();
    }
}
