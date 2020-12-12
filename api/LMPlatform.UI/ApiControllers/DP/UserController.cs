using System.Collections.Generic;
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
    public class UserController : ApiController
    {
        public UserData Get()
        {
            return UserService.GetUserInfo(UserContext.CurrentUserId);
        }

        private readonly LazyDependency<IUserService> userService = new LazyDependency<IUserService>();

        private IUserService UserService
        {
            get { return userService.Value; }
        }
    }
}
