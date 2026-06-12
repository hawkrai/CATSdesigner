using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using Application.Core;
using Application.Core.Data;
using Application.Core.Helpers;
using Application.Infrastructure.DPManagement;
using Application.Infrastructure.DTO;
using LMPlatform.UI.Attributes;
using System.Linq;
using WebMatrix.WebData;

namespace LMPlatform.UI.ApiControllers.DP
{
    [JwtAuth]
    public class DpPercentageController : ApiController
    {
        private readonly LazyDependency<IDpPercentageGraphService> _percentageService = new LazyDependency<IDpPercentageGraphService>();

        private IDpPercentageGraphService PercentageService
        {
            get { return _percentageService.Value; }
        }

        public PagedList<PercentageGraphData> Get([ModelBinder]GetPagedListParams parms)
        {
            var result = PercentageService.GetPercentageGraphs(UserContext.CurrentUserId, parms);
            var filtered = result.Items.Where(x => x.SelectedGroupsIds != null && x.SelectedGroupsIds.Any()).ToList();
            return new PagedList<PercentageGraphData> { Items = filtered, Total = filtered.Count };
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
