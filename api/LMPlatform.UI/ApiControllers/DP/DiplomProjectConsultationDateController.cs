using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Application.Core;
using Application.Core.Helpers;
using Application.Infrastructure.DPManagement;
using Application.Infrastructure.DTO;
using LMPlatform.UI.Attributes;
using WebMatrix.WebData;

namespace LMPlatform.UI.ApiControllers.DP
{
    [JwtAuth]
    public class DiplomProjectConsultationDateController : ApiController
    {
        public HttpResponseMessage Post([FromBody] DiplomProjectConsultationDateData consultationDate)
        {
            PercentageService.SaveConsultationDate(UserContext.CurrentUserId, consultationDate.Day, consultationDate.StartTime, consultationDate.EndTime,
                consultationDate.Audience, consultationDate.Building);
            return new HttpResponseMessage(HttpStatusCode.OK);
        }

        public void Post(int id)
        {
            PercentageService.DeleteConsultationDate(UserContext.CurrentUserId, id);
        }

        private IDpPercentageGraphService PercentageService
        {
            get { return _percentageService.Value; }
        }

        private readonly LazyDependency<IDpPercentageGraphService> _percentageService = new LazyDependency<IDpPercentageGraphService>();
    }
}