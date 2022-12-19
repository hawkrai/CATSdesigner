using System.Diagnostics.CodeAnalysis;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using Application.Core;
using Application.Core.Data;
using Application.Infrastructure.CPManagement;
using Application.Infrastructure.CTO;
using LMPlatform.UI.Attributes;

namespace LMPlatform.UI.ApiControllers.CP
{
    [JwtAuth]
    public class CourseStudentController : ApiController
    {
        private readonly LazyDependency<ICPManagementService> _cpManagementService = new LazyDependency<ICPManagementService>();

        private ICPManagementService CpManagementService
            => _cpManagementService.Value;

        public PagedList<StudentData> Get([ModelBinder]GetPagedListParams parameters)
        {
            return CpManagementService.GetStudentsByCourseProjectId(parameters);
        }
    }
}