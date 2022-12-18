using Application.Core;
using Application.Infrastructure.CPManagement;
using Application.Infrastructure.CTO;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Web.Http;
using LMPlatform.UI.Attributes;

namespace LMPlatform.UI.ApiControllers.CP
{
    [JwtAuth]
    public class CourseProjectGroupController : ApiController
    {
        private readonly LazyDependency<ICPManagementService> _cpManagementService = new LazyDependency<ICPManagementService>();

        private ICPManagementService CPManagementService
            => _cpManagementService.Value;

        [HttpGet]
        public List<Correlation> Get(int id)
        {
            return CPManagementService.GetGroups(id);
        }
    }
}