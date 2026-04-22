using System.Collections.Generic;
using System.Web;
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
    public class DpCorrelationController : ApiController
    {
        private readonly LazyDependency<ICorrelationService> correlationService = new LazyDependency<ICorrelationService>();

        private ICorrelationService CorrelationService
        {
            get { return correlationService.Value; }
        }

        public List<Correlation> Get()
        {
            var query = HttpUtility.ParseQueryString(Request.RequestUri.Query);
            var entity = query["entity"];
            var isSecretaryParam = query["isSecretary"];
            var isSecretary = isSecretaryParam != null && isSecretaryParam.ToLower() == "true";

            return CorrelationService.GetCorrelation(entity, UserContext.CurrentUserId, isSecretary);
        }
    }
}