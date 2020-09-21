using System.Web.Mvc;
using Application.Core;
using Application.Core.Extensions;
using Application.Core.UI.Controllers;
using Application.Infrastructure.DPManagement;
using Application.Infrastructure.StudentManagement;
using LMPlatform.UI.Attributes;
using LMPlatform.UI.ViewModels.AdministrationViewModels;
using LMPlatform.UI.ViewModels.LmsViewModels;
using WebMatrix.WebData;

namespace LMPlatform.UI.Controllers
{
    [JwtAuth(Roles = "student, lector")]
    public class LmsController : BasicController
    {
        private readonly LazyDependency<IDpManagementService> _diplomProjectManagementService =
            new LazyDependency<IDpManagementService>();

        private readonly LazyDependency<IStudentManagementService> _studentManagementService =
            new LazyDependency<IStudentManagementService>();

        private IDpManagementService DpManagementService => this._diplomProjectManagementService.Value;

        private IStudentManagementService StudentManagementService => this._studentManagementService.Value;

        [HttpGet]
        public ActionResult Index(string userLogin = "")
        {
            var model = new LmsViewModel(WebSecurity.CurrentUserId, this.User.IsInRole("lector"))
            {
                UserActivity = new UserActivityViewModel()
            };
            var dynamicModel = model.AsExpandoObject();
            dynamicModel.ShowDpSectionForUser =
                this.DpManagementService.ShowDpSectionForUser(WebSecurity.CurrentUserId);
            dynamicModel.IsMyProfile = string.IsNullOrEmpty(userLogin) || WebSecurity.CurrentUserName == userLogin;
            dynamicModel.UserLogin = string.IsNullOrEmpty(userLogin) || WebSecurity.CurrentUserName == userLogin
                ? WebSecurity.CurrentUserName
                : userLogin;
            dynamicModel.UnconfirmedStudents =
                this.StudentManagementService.CountUnconfirmedStudents(WebSecurity.CurrentUserId) > 0;

            return JsonResponse(model);
        }
    }
}