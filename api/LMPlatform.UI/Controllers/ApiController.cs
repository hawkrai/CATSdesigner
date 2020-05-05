using System.Linq;
using System.Web.Mvc;
using Application.Core;
using Application.Infrastructure.SubjectManagement;
using Application.Infrastructure.UserManagement;
using WebMatrix.WebData;

namespace LMPlatform.UI.Controllers
{
    public class RemoteApiController : Controller
    {
        private readonly LazyDependency<ISubjectManagementService> subjectManagementService =
            new LazyDependency<ISubjectManagementService>();

        public ISubjectManagementService SubjectManagementService => this.subjectManagementService.Value;

        [HttpPost]
        public ActionResult Login(string userName, string password)
        {
            if (WebSecurity.Login(userName, password))
            {
                var _context = new UsersManagementService();
                var user = _context.GetUser(userName);

                return this.Json(new
                {
                    UserName = userName,
                    UserId = user.Id
                });
            }

            this.Response.StatusCode = 401;

            return this.Json(new
            {
                Error = "Введите корректные данные"
            });
        }

        [HttpGet]
        public ActionResult GetSubjectByUserId(string userId)
        {
            var data = this.SubjectManagementService.GetUserSubjects(int.Parse(userId));

            var result = data.Where(x => !x.IsArchive).Select(e => new {e.Id, e.ShortName, e.Name});

            return this.Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}