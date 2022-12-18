using System.Diagnostics.CodeAnalysis;
using System.Web.Http;
using Application.Core;
using Application.Core.Helpers;
using Application.Infrastructure.CPManagement;
using LMPlatform.Models.CP;
using LMPlatform.UI.Attributes;

namespace LMPlatform.UI.ApiControllers.CP
{
    [JwtAuth]
    public class CourseProjectAssignmentController : ApiController
    {
        [SuppressMessage("StyleCop.CSharp.NamingRules", "SA1305:FieldNamesMustNotUseHungarianNotation", Justification = "Reviewed. Suppression is OK here.")]
        private readonly LazyDependency<ICPManagementService> _cpManagementService = new LazyDependency<ICPManagementService>();

        private ICPManagementService CpManagementService 
            => _cpManagementService.Value;
        
        public void Post([FromBody]AssignProjectUpdateModel updateModel)
        {
            CpManagementService.AssignProject(UserContext.CurrentUserId, updateModel.ProjectId, updateModel.StudentId);
        }

        public void Post(int id)
        {
            CpManagementService.DeleteAssignment(UserContext.CurrentUserId, id);
        }
    }
}
