using System.Net;
using System.Net.Http;
using System.Web.Http;
using Application.Core;
using Application.Core.Data;
using Application.Core.Helpers;
using Application.Infrastructure.CPManagement;
using Application.Infrastructure.CTO;
using Application.Infrastructure.UserManagement;
using LMPlatform.UI.Attributes;

namespace LMPlatform.UI.ApiControllers.CP
{
    [JwtAuth]
    public class CourseProjectConsultationController : ApiController
    {
        private readonly LazyDependency<ICPManagementService> _courseProjectManagementService = new LazyDependency<ICPManagementService>();

        private readonly LazyDependency<ICpPercentageGraphService> _percentageService = new LazyDependency<ICpPercentageGraphService>();

        private readonly LazyDependency<IUsersManagementService> _userManagementService = new LazyDependency<IUsersManagementService>();

        private ICPManagementService CpManagementService =>
            _courseProjectManagementService.Value;

        private ICpPercentageGraphService PercentageService =>
            _percentageService.Value;

        private IUsersManagementService UserManagementService =>
            _userManagementService.Value;

        public CourseProjectConsultationData Get([System.Web.Http.ModelBinding.ModelBinder] GetPagedListParams parms)
        {
            var userId = UserContext.CurrentUserId;

            var groupId = 0;
            if (UserContext.Role == "student")
            {
                groupId = UserManagementService.GetUserById(userId).Student.GroupId;
            }

            return new CourseProjectConsultationData
            {
                Students = CpManagementService.GetGraduateStudentsForGroup(userId, groupId, subjectId: 0, parms, false),
                Consultations = PercentageService.GetConsultationDatesForUser(userId, groupId),
            };
        }

        public HttpResponseMessage Post([FromBody]CourseProjectConsultationMarkData consultationMark)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            PercentageService.SaveConsultationMark(UserContext.CurrentUserId, consultationMark);

            return new HttpResponseMessage(HttpStatusCode.OK);
        }
    }
}