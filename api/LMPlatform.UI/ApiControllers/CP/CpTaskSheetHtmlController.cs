using System.Web.Http;
using Application.Core;
using Application.Infrastructure.CPManagement;
using LMPlatform.UI.Attributes;

namespace LMPlatform.UI.ApiControllers.CP
{
    [JwtAuth]
    public class CpTaskSheetHtmlController : ApiController
    {
        private readonly LazyDependency<ICPManagementService> _cpManagementService = new LazyDependency<ICPManagementService>();

        private ICPManagementService CpManagementService
            => _cpManagementService.Value;

        // GET api/<controller>/5
        public string Get(int courseProjectId, string language)
        {
            return CpManagementService.GetTasksSheetHtml(courseProjectId, language);

        }
    }
}