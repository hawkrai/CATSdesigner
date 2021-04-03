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

        // GET api/<controller>
        public List<Correlation> Get()
        {
            var entity = HttpUtility.ParseQueryString(Request.RequestUri.Query)["entity"];
            return CorrelationService.GetCorrelation(entity, UserContext.CurrentUserId);
        }
    }
}