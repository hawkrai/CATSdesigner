using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Application.Core;
using Application.Core.Helpers;
using Application.Infrastructure.DPManagement;
using LMPlatform.UI.Attributes;
using WebMatrix.WebData;

namespace LMPlatform.UI.ApiControllers.DP
{
    [JwtAuth]
    public class DiplomProjectConsultationDateController : ApiController
    {
        public HttpResponseMessage Post([FromBody]DateTime consultationDate)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            PercentageService.SaveConsultationDate(UserContext.CurrentUserId, consultationDate);
            return new HttpResponseMessage(HttpStatusCode.OK);
        }

        public void Delete(int id)
        {
            PercentageService.DeleteConsultationDate(UserContext.CurrentUserId, id);
        }

        private IPercentageGraphService PercentageService
        {
            get { return _percentageService.Value; }
        }

        private readonly LazyDependency<IPercentageGraphService> _percentageService = new LazyDependency<IPercentageGraphService>();
    }
}