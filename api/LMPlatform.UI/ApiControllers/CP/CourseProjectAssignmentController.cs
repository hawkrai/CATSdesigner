using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Application.Core;
using Application.Core.Helpers;
using Application.Infrastructure.CPManagement;
using LMPlatform.Models.CP;
using LMPlatform.UI.Attributes;
using LMPlatform.UI.ViewModels.CPViewModels;

namespace LMPlatform.UI.ApiControllers.CP
{
    [JwtAuth]
    public class CourseProjectAssignmentController : ApiController
    {
        private readonly LazyDependency<ICPManagementService> _cpManagementService = new LazyDependency<ICPManagementService>();

        private ICPManagementService CpManagementService
            => _cpManagementService.Value;

        public IEnumerable<AssignedCourseProjectViewModel> Get(int subjectId) 
        {
            return CpManagementService.GetAssignedCourseProjects(subjectId)
                .Select(x => new AssignedCourseProjectViewModel(x));
        }

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