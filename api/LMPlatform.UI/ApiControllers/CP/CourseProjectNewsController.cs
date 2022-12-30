using Application.Core;
using Application.Infrastructure.CPManagement;
using Application.Infrastructure.CTO;
using LMPlatform.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using Application.Core.Helpers;
using LMPlatform.Models.CP;
using LMPlatform.UI.Attributes;

namespace LMPlatform.UI.ApiControllers.CP
{
    [JwtAuth]
    public class CourseProjectNewsController : ApiController
    {
        private readonly LazyDependency<ICPManagementService> _cpManagementService = new LazyDependency<ICPManagementService>();

        private ICPManagementService CpManagementService
            => _cpManagementService.Value;

        [HttpGet]
        public List<NewsData> Get(int id)
        {
            return CpManagementService.GetNewses(UserContext.CurrentUserId, id);
        }

        [HttpDelete]
        public async Task<DeleteNewsMessage> Delete([FromBody]CourseProjectNews deleteData)
        {
            return await CpManagementService.DeleteNewsAsync(deleteData);
        }
    }
}
