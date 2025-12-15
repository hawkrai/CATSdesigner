using Application.Core;
using Application.Infrastructure.CPManagement;
using LMPlatform.UI.Attributes;
using System;
using System.Net.Http;
using System.Web.Http;

namespace LMPlatform.UI.ApiControllers.CP
{
    [JwtAuth]
    public class CpTaskSheetDownloadController : ApiController
    {
        private readonly LazyDependency<ICPManagementService> _courseProjectManagementService = new LazyDependency<ICPManagementService>();

        private ICPManagementService CpManagementService => _courseProjectManagementService.Value;

        public HttpResponseMessage Get(int courseProjectId, string lang)
        {
            return CpManagementService.DownloadTaskSheet(courseProjectId, lang);
        }

        public HttpResponseMessage Get(int groupId, int subjectId)
        {
            return CpManagementService.DownloadTaskSheet(groupId, subjectId);
        }
    }
}