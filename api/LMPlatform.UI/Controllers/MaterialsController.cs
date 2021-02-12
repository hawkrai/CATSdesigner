using System.Dynamic;
using System.Linq;
using System.Web.Mvc;
using Application.Core.UI.Controllers;
using Application.Infrastructure.FoldersManagement;
using Application.Infrastructure.SubjectManagement;
using LMPlatform.UI.Attributes;

namespace LMPlatform.UI.Controllers
{
    [JwtAuth]
    public class MaterialsController : BasicController
    {
        public IFoldersManagementService FoldersManagementService =>
            this.ApplicationService<IFoldersManagementService>();

        public ISubjectManagementService SubjectManagementService =>
            this.ApplicationService<ISubjectManagementService>();

        public ActionResult Index(int subjectId)
        {
            dynamic dynamicObject = new ExpandoObject();

            var folders = this.FoldersManagementService.GetAllFolders();
            var subject = this.SubjectManagementService.GetSubject(subjectId);
            var subjectModulesId = subject.SubjectModules.First(e => e.ModuleId == 9).Id;
            var rootFolder = this.FoldersManagementService.FolderRootBySubjectModuleId(subjectModulesId);

            dynamicObject.Folders = folders;
            dynamicObject.Folder = rootFolder;
            dynamicObject.NgApp = "materialsApp";
            dynamicObject.NgController = "homeCtrl";

            return JsonResponse(dynamicObject);
        }
    }
}