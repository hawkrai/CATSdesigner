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
    public class CpPercentageResultController : ApiController
    {

        private readonly LazyDependency<ICPManagementService> _courseProjectManagementService = new LazyDependency<ICPManagementService>();

        private readonly LazyDependency<ICpPercentageGraphService> _percentageService = new LazyDependency<ICpPercentageGraphService>();

        private ICpPercentageGraphService PercentageService
        => _percentageService.Value;

        private ICPManagementService CpManagementService
            => _courseProjectManagementService.Value;

        public CourseProjectPercentageResult Get([System.Web.Http.ModelBinding.ModelBinder]GetPagedListParams parms)
        {
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

            var currentUserId = UserContext.CurrentUserId;
            var isStudent = UserContext.Role == "student";

            var students = CpManagementService.GetGraduateStudentsForGroup(currentUserId, groupId, subjectId, parms, false);

            if (isStudent)
            {
                foreach (var student in students.Items)
                {
                    if (student.ShowForStudent != true)
                    {
                        student.Comment = null;
                    }

                    foreach (var pr in student.PercentageResults)
                    {
                        if (pr.ShowForStudent != true)
                        {
                            pr.Comment = null;
                        }
                    }

                    foreach (var cm in student.CourseProjectConsultationMarks)
                    {
                        if (cm.ShowForStudent != true)
                        {
                            cm.Comment = null;
                        }
                    }
                }
            }

            return new CourseProjectPercentageResult
            {
                Students = students,
                PercentageGraphs = PercentageService.GetPercentageGraphsForLecturerAll(currentUserId, parms)
            };
        }

        public HttpResponseMessage Post([FromBody]PercentageResultData percentage)
        {
            return SavePercentageResult(percentage);
        }

        public HttpResponseMessage Put([FromBody]PercentageResultData percentage)
        {
            return SavePercentageResult(percentage);
        }

        private HttpResponseMessage SavePercentageResult(PercentageResultData percentageResult)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            PercentageService.SavePercentageResult(UserContext.CurrentUserId, percentageResult);

            return new HttpResponseMessage(HttpStatusCode.OK);
        }
    }
}