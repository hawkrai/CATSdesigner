using Application.Core;
using Application.Infrastructure.CPManagement;
using Application.Infrastructure.CTO;
using System.Web.Http;
using Application.Core.Helpers;
using LMPlatform.UI.Attributes;

namespace LMPlatform.UI.ApiControllers.CP
{
    [JwtAuth]
    public class CourseUserController : ApiController
    {
        private readonly LazyDependency<ICPUserService> _userService = new LazyDependency<ICPUserService>();

        private ICPUserService UserService
            => _userService.Value;

        public UserData Get()
        {
            return UserService.GetUserInfo(UserContext.CurrentUserId);
        }
    }
}