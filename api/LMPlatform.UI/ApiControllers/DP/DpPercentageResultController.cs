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
using System.Linq;
using WebMatrix.WebData;

namespace LMPlatform.UI.ApiControllers.DP
{
    [JwtAuth]
    public class DpPercentageResultController : ApiController
    {
        public object Get([System.Web.Http.ModelBinding.ModelBinder] GetPagedListParams parms)
        {
            var currentUserId = UserContext.CurrentUserId;
            var isStudent = AuthorizationHelper.IsStudent(Context, currentUserId);

            var students = DpManagementService.GetGraduateStudentsForUser(currentUserId, parms);

            if (isStudent)
            {
                var currentGroupId = Context.Users
                    .Where(x => x.Id == currentUserId)
                    .Select(x => x.Student.GroupId)
                    .Single();

                var filtered = students.Items.Where(x => x.GroupId == currentGroupId).ToList();
                students = new PagedList<StudentData> { Items = filtered, Total = filtered.Count };

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
                PercentageGraphs = PercentageService.GetPercentageGraphsForLecturerAll(currentUserId, parms)
            };
        }

        private IDpContext Context
        {
            get { return _context.Value; }
        }

        private readonly LazyDependency<IDpContext> _context = new LazyDependency<IDpContext>();

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

        private IDpPercentageGraphService PercentageService
        {
            get { return _percentageService.Value; }
        }

        private IDpManagementService DpManagementService
        {
            get { return _diplomProjectManagementService.Value; }
        }

        private readonly LazyDependency<IDpManagementService> _diplomProjectManagementService = new LazyDependency<IDpManagementService>();

        private readonly LazyDependency<IDpPercentageGraphService> _percentageService = new LazyDependency<IDpPercentageGraphService>();
    }
}