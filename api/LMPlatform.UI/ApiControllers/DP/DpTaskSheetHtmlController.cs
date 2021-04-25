using Application.Core;
using Application.Infrastructure.DPManagement;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace LMPlatform.UI.ApiControllers.DP
{
    public class DpTaskSheetHtmlController : ApiController
    {
        private readonly LazyDependency<IDpManagementService> _dpManagementService = new LazyDependency<IDpManagementService>();

        private IDpManagementService DpManagementService
        {
            get { return _dpManagementService.Value; }
        }

        // GET api/<controller>/5
        public string Get(int diplomProjectId)
        {
            return DpManagementService.GetTasksSheetHtml(diplomProjectId);
        }
    }
}