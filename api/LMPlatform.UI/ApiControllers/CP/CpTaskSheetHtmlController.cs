using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Application.Core;
using Application.Infrastructure.CPManagement;

namespace LMPlatform.UI.ApiControllers.CP
{
    public class CpTaskSheetHtmlController : ApiController
    {
        private readonly LazyDependency<ICPManagementService> _cpManagementService = new LazyDependency<ICPManagementService>();

        private ICPManagementService CpManagementService
        {
            get { return _cpManagementService.Value; }
        }

        // GET api/<controller>/5
        public string Get(int courseProjectId)
        {
            return CpManagementService.GetTasksSheetHtml(courseProjectId);
        }
    }
}