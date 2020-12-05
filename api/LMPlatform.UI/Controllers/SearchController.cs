using System.Net;
using System.Web.Mvc;
using Application.Core;
using Application.Core.UI.Controllers;
using Application.Infrastructure.GroupManagement;
using Application.Infrastructure.LecturerManagement;
using Application.Infrastructure.ProjectManagement;
using Application.Infrastructure.StudentManagement;
using Application.SearchEngine.SearchMethods;
using LMPlatform.UI.Attributes;
using LMPlatform.UI.ViewModels.SearchViewModel;

namespace LMPlatform.UI.Controllers
{
    [JwtAuth]
    public class SearchController : BasicController
    {
        private readonly LazyDependency<IGroupManagementService> _groupRepository =
            new LazyDependency<IGroupManagementService>();

        private readonly LazyDependency<ILecturerManagementService> _lecturerRepository =
            new LazyDependency<ILecturerManagementService>();

        private readonly LazyDependency<IProjectManagementService> _projectRepository =
            new LazyDependency<IProjectManagementService>();

        private readonly LazyDependency<IStudentManagementService> _studentRepository =
            new LazyDependency<IStudentManagementService>();

        [HttpGet]
        public ActionResult Index(string query)
        {
            if (string.IsNullOrEmpty(query))
                return StatusCode(HttpStatusCode.BadRequest);

            var model = new SearchViewModel();

            var ssm = new StudentSearchMethod();
            if (!ssm.IsIndexExist())
                ssm.AddToIndex(this._studentRepository.Value.GetStudents());
            model.Students = ssm.Search(query);

            var gSearchMethod = new GroupSearchMethod();
            if (!gSearchMethod.IsIndexExist())
                gSearchMethod.AddToIndex(this._groupRepository.Value.GetGroups());
            model.Groups = gSearchMethod.Search(query);

            var psm = new ProjectSearchMethod();
            if (!psm.IsIndexExist())
                psm.AddToIndex(this._projectRepository.Value.GetProjects());
            model.Projects = psm.Search(query);

            var lsm = new LecturerSearchMethod();
            if (!lsm.IsIndexExist())
                lsm.AddToIndex(this._lecturerRepository.Value.GetLecturers());
            model.Lecturers = lsm.Search(query);

            return JsonResponse(model);
        }
    }
}