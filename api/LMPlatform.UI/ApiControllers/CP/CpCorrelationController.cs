using System.Collections.Generic;
using System.Web;
using System.Web.Http;
using Application.Core;
using Application.Core.Helpers;
using Application.Infrastructure.CPManagement;
using Application.Infrastructure.CTO;
using LMPlatform.UI.Attributes;

namespace LMPlatform.UI.ApiControllers.CP
{
    [JwtAuth]
    public class CpCorrelationController : ApiController
    {
        private readonly LazyDependency<ICpCorrelationService> _correlationService = new LazyDependency<ICpCorrelationService>();

        private ICpCorrelationService CorrelationService
            => _correlationService.Value;

        // GET api/<controller>
        public List<Correlation> Get()
        {
            var entity = HttpUtility.ParseQueryString(Request.RequestUri.Query)["entity"];
          
            var subjectId = HttpUtility.ParseQueryString(Request.RequestUri.Query)["subjectId"];

            if (subjectId is null)
            {
                return CorrelationService.GetCorrelation(entity, 0, UserContext.CurrentUserId);
            }
            
            return CorrelationService.GetCorrelation(entity, int.Parse(subjectId), UserContext.CurrentUserId);
        }
    }
}