using Application.Core;
using Application.Infrastructure.CTO;
using Application.Infrastructure.CPManagement;
using System.Diagnostics.CodeAnalysis;
using System.Web.Http;
using LMPlatform.UI.Attributes;

namespace LMPlatform.UI.ApiControllers.CP
{
    [JwtAuth]
    public class CourseProjectSubjectController : ApiController
    {
        private readonly LazyDependency<ICPManagementService> _cpManagementService = new LazyDependency<ICPManagementService>();

        private ICPManagementService CpManagementService
            => _cpManagementService.Value;

        public SubjectData Get(int id)
        {
            return CpManagementService.GetSubject(id);
        }
    }
}
