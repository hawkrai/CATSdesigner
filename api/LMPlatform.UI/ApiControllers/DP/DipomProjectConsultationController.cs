using System.Net;
using System.Net.Http;
using System.Web.Http;
using Application.Core;
using Application.Core.Data;
using Application.Core.Helpers;
using Application.Infrastructure.DPManagement;
using Application.Infrastructure.DTO;
using LMPlatform.UI.Attributes;
using WebMatrix.WebData;

namespace LMPlatform.UI.ApiControllers.DP
{
    [JwtAuth]
    public class DipomProjectConsultationController : ApiController
    {
        public object Get([System.Web.Http.ModelBinding.ModelBinder]GetPagedListParams parms)
        {
            var lecturerId = UserContext.CurrentUserId;
            if (parms.Filters.ContainsKey("lecturerId"))
            {
                lecturerId = int.Parse(parms.Filters["lecturerId"]);
            }

            return new
            {
                Students = DpManagementService.GetGraduateStudentsForUser(lecturerId, parms, false),
                DipomProjectConsultationDates = PercentageService.GetConsultationDatesForUser(lecturerId)
            };
        }

        public HttpResponseMessage Post([FromBody]DipomProjectConsultationMarkData consultationMark)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            PercentageService.SaveConsultationMark(UserContext.CurrentUserId, consultationMark);
            return new HttpResponseMessage(HttpStatusCode.OK);
        }

        private IDpManagementService DpManagementService
        {
            get { return _diplomProjectManagementService.Value; }
        }

        private IPercentageGraphService PercentageService
        {
            get { return _percentageService.Value; }
        }

        private readonly LazyDependency<IDpManagementService> _diplomProjectManagementService = new LazyDependency<IDpManagementService>();

        private readonly LazyDependency<IPercentageGraphService> _percentageService = new LazyDependency<IPercentageGraphService>();
    }
}