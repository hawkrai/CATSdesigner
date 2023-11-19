using System.Net;
using System.Net.Http;
using System.Web.Http;
using Application.Core;
using Application.Core.Data;
using Application.Core.Helpers;
using Application.Infrastructure.CPManagement;
using Application.Infrastructure.CTO;
using LMPlatform.UI.Attributes;

namespace LMPlatform.UI.ApiControllers.CP
{
    [JwtAuth]
    public class CourseProjectConsultationController : ApiController
    {
        private readonly LazyDependency<ICPManagementService> _courseProjectManagementService = new LazyDependency<ICPManagementService>();

        private readonly LazyDependency<ICpPercentageGraphService> _percentageService = new LazyDependency<ICpPercentageGraphService>();

        private ICPManagementService CpManagementService =>
            _courseProjectManagementService.Value;

        private ICpPercentageGraphService PercentageService =>
            _percentageService.Value;

        public CourseProjectConsultationData Get([System.Web.Http.ModelBinding.ModelBinder]GetPagedListParams parms)
        {
            var lecturerId = UserContext.CurrentUserId;

            if (parms.Filters.ContainsKey("lecturerId"))
            {
                lecturerId = int.Parse(parms.Filters["lecturerId"]);
            }

            var subjectId = 0;

            if (parms.Filters.ContainsKey("subjectId"))
            {
                subjectId = int.Parse(parms.Filters["subjectId"]);
            }

            var groupId = 0;

            if (parms.Filters.ContainsKey("groupId"))
            {
                groupId = int.Parse(parms.Filters["groupId"]);
            }

            return new CourseProjectConsultationData
            {
                Students = CpManagementService.GetGraduateStudentsForGroup(lecturerId, groupId, subjectId, parms, false),
                Consultations = PercentageService.GetConsultationDatesForUser(lecturerId, subjectId)
            };
        }

        public HttpResponseMessage Post([FromBody]CourseProjectConsultationMarkData consultationMark)
        {
            System.Diagnostics.Debugger.Launch();
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            PercentageService.SaveConsultationMark(UserContext.CurrentUserId, consultationMark);

            return new HttpResponseMessage(HttpStatusCode.OK);
        }
    }
}