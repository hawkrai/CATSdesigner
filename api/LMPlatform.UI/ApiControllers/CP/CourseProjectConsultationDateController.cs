using System.Net;
using System.Net.Http;
using System.Web.Http;
using Application.Core;
using Application.Core.Helpers;
using Application.Infrastructure.CPManagement;
using Application.Infrastructure.CTO;
using LMPlatform.UI.Attributes;

namespace LMPlatform.UI.ApiControllers.CP
{
    [JwtAuth]
    public class CourseProjectConsultationDateController : ApiController
    {
        private readonly LazyDependency<ICpPercentageGraphService> _percentageService = new LazyDependency<ICpPercentageGraphService>();

        private ICpPercentageGraphService PercentageService
            => _percentageService.Value;

        public HttpResponseMessage Post([FromBody]CourseProjectConsultationDateData consultationDate)
        {
            PercentageService.SaveConsultationDate(UserContext.CurrentUserId, consultationDate.Day, consultationDate.SubjectId, consultationDate.StartTime,
                consultationDate.EndTime, consultationDate.Audience, consultationDate.Building);

            return new HttpResponseMessage(HttpStatusCode.OK);
        }

        public void Post(int id)
        {
            PercentageService.DeleteConsultationDate(UserContext.CurrentUserId, id);
        }
    }
}