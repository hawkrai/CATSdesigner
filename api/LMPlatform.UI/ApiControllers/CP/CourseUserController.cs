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
        public UserData Get()
        {
            return UserService.GetUserInfo(UserContext.CurrentUserId);
        }

        private readonly LazyDependency<ICPUserService> userService = new LazyDependency<ICPUserService>();

        private ICPUserService UserService
        {
            get { return userService.Value; }
        }

    }
}
