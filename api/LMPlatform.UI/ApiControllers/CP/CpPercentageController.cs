using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using Application.Core;
using Application.Core.Data;
using Application.Core.Helpers;
using Application.Infrastructure.CPManagement;
using Application.Infrastructure.CTO;
using LMPlatform.UI.Attributes;
using WebMatrix.WebData;

namespace LMPlatform.UI.ApiControllers.CP
{
    [JwtAuth]
    public class CpPercentageController : ApiController
    {
        private readonly LazyDependency<ICpPercentageGraphService> _percentageService = new LazyDependency<ICpPercentageGraphService>();

        private ICpPercentageGraphService PercentageService
        {
            get { return _percentageService.Value; }
        }

        public PagedList<PercentageGraphData> Get([ModelBinder]GetPagedListParams parms)
        {
            return PercentageService.GetPercentageGraphs(UserContext.CurrentUserId, parms);
        }

        public PercentageGraphData Get(int id)
        {
            return PercentageService.GetPercentageGraph(id);
        }

        public HttpResponseMessage Post([FromBody]PercentageGraphData percentage)
        {
            return SavePercentage(percentage);
        }

        public HttpResponseMessage Put([FromBody]PercentageGraphData percentage)
        {
            return SavePercentage(percentage);
        }

        public void Post(int id)
        {
            PercentageService.DeletePercentage(UserContext.CurrentUserId, id);
        }

        private HttpResponseMessage SavePercentage(PercentageGraphData percentage)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
            
            PercentageService.SavePercentage(UserContext.CurrentUserId, percentage);
            return new HttpResponseMessage(HttpStatusCode.OK);
        }
    }
}
