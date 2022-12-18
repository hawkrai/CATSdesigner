using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
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
        [SuppressMessage("StyleCop.CSharp.NamingRules", "SA1305:FieldNamesMustNotUseHungarianNotation", Justification = "Reviewed. Suppression is OK here.")]
        private readonly LazyDependency<ICPManagementService> _cpManagementService = new LazyDependency<ICPManagementService>();

        private ICPManagementService CpManagementService
        {
            get { return _cpManagementService.Value; }
        }

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

        public class AssignProjectUpdateModel
        {
            public int ProjectId { get; set; }

            public int StudentId { get; set; }
        }
    }
}
