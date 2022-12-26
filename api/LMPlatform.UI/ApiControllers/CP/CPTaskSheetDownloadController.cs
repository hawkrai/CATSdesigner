using System.Linq;
using System.Net.Http;
using System.Web.Http;
using Application.Infrastructure.Export;
using LMPlatform.Data.Infrastructure;
using System.Data.Entity;
using Application.Core;
using LMPlatform.UI.Attributes;
using Application.Core.Helpers;
using Application.Infrastructure.CPManagement;

namespace LMPlatform.UI.ApiControllers.CP
{
    [JwtAuth]
    public class CpTaskSheetDownloadController : ApiController
    {
        private readonly LazyDependency<ICPManagementService> _courseProjectManagementService = new LazyDependency<ICPManagementService>();

        private ICPManagementService CpManagementService
            => _courseProjectManagementService.Value;

        public HttpResponseMessage Get(int courseProjectId)
        {
            return CpManagementService.DownloadTaskSheet(courseProjectId);
        }

        public HttpResponseMessage Get(int groupId, int subjectId)
        {
            return CpManagementService.DownloadTaskSheet(groupId, subjectId);
        }
    }
}