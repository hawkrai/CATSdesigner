using System.Diagnostics.CodeAnalysis;
using System.Web.Http;
using Application.Core;
using Application.Core.Helpers;
using Application.Infrastructure.DPManagement;
using LMPlatform.UI.Attributes;
using WebMatrix.WebData;

namespace LMPlatform.UI.ApiControllers.DP
{
    [JwtAuth]
    public class DiplomProjectAssignmentController : ApiController
    {
        [SuppressMessage("StyleCop.CSharp.NamingRules", "SA1305:FieldNamesMustNotUseHungarianNotation", Justification = "Reviewed. Suppression is OK here.")]
        private readonly LazyDependency<IDpManagementService> _dpManagementService = new LazyDependency<IDpManagementService>();

        private IDpManagementService DpManagementService
        {
            get { return _dpManagementService.Value; }
        }

        public void Post([FromBody]AssignProjectUpdateModel updateModel)
        {
            DpManagementService.AssignProject(UserContext.CurrentUserId, updateModel.ProjectId, updateModel.StudentId);
        }

        public void Post(int id)
        {
            DpManagementService.DeleteAssignment(UserContext.CurrentUserId, id);
        }

        public class AssignProjectUpdateModel
        {
            public int ProjectId { get; set; } 

            public int StudentId { get; set; } 
        }
    }
}