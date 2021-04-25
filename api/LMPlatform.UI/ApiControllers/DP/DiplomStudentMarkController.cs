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
    public class DiplomStudentMarkController : ApiController
    {
        public HttpResponseMessage Post([FromBody]DiplomStudentMarkModel diplomStudentMarkModel)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            DpManagementService.SetStudentDiplomMark(UserContext.CurrentUserId, diplomStudentMarkModel);
            return new HttpResponseMessage(HttpStatusCode.OK);
        }

        private IDpManagementService DpManagementService
        {
            get { return _diplomProjectManagementService.Value; }
        }

        private readonly LazyDependency<IDpManagementService> _diplomProjectManagementService = new LazyDependency<IDpManagementService>();
    }
}