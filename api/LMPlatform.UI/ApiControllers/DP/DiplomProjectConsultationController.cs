using System.Net;
using System.Net.Http;
using System.Web.Http;
using Application.Core;
using Application.Core.Data;
using Application.Core.Helpers;
using Application.Infrastructure.DPManagement;
using Application.Infrastructure.DTO;
using LMPlatform.Data.Infrastructure;
using LMPlatform.UI.Attributes;
using WebMatrix.WebData;

namespace LMPlatform.UI.ApiControllers.DP
{
    [JwtAuth]
    public class DiplomProjectConsultationController : ApiController
    {
        public object Get([System.Web.Http.ModelBinding.ModelBinder] GetPagedListParams parms)
        {
            var currentUserId = UserContext.CurrentUserId;
            var isStudent = AuthorizationHelper.IsStudent(Context, currentUserId);

            var lecturerId = currentUserId;
            if (parms.Filters.ContainsKey("lecturerId"))
            {
                var parsedId = int.Parse(parms.Filters["lecturerId"]);
                if (parsedId != 0)
                {
                    lecturerId = parsedId;
                }
            }

            var students = DpManagementService.GetGraduateStudentsForUser(currentUserId, parms, false);

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
                }
            }

            return new
            {
                Students = students,
                DiplomProjectConsultationDates = PercentageService.GetConsultationDatesForUser(lecturerId)
            };
        }

        public HttpResponseMessage Post([FromBody]DiplomProjectConsultationMarkData consultationMark)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
            PercentageService.SaveConsultationMark(UserContext.CurrentUserId, consultationMark);
            return new HttpResponseMessage(HttpStatusCode.OK);
        }

        private IDpContext Context
        {
            get { return _context.Value; }
        }

        private IDpManagementService DpManagementService
        {
            get { return _diplomProjectManagementService.Value; }
        }

        private IDpPercentageGraphService PercentageService
        {
            get { return _percentageService.Value; }
        }

        private readonly LazyDependency<IDpContext> _context = new LazyDependency<IDpContext>();
        private readonly LazyDependency<IDpManagementService> _diplomProjectManagementService = new LazyDependency<IDpManagementService>();
        private readonly LazyDependency<IDpPercentageGraphService> _percentageService = new LazyDependency<IDpPercentageGraphService>();
    }
}