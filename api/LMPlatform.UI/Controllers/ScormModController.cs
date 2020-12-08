using System;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Application.Core.Data;
using Ionic.Zip;
using LMPlatform.Data.Repositories;
using LMPlatform.Models;
using LMPlatform.UI.Attributes;
using SCORMHost;

namespace LMPlatform.UI.Controllers
{
    [JwtAuth]
    public class ScormModController : Controller
    {
        public string ScoFilePath => ConfigurationManager.AppSettings["ScoFilePath"];

        public ActionResult GetObjects()
        {
            using var repositoriesContainer = new LmPlatformRepositoriesContainer();
            return this.Json(
                repositoriesContainer.RepositoryFor<ScoObjects>().GetAll(new Query<ScoObjects>(e => !e.IsDeleted))
                    .ToList(), JsonRequestBehavior.AllowGet);
        }

        public ActionResult LoadObject(string name, HttpPostedFileBase file)
        {
            var guid = Guid.NewGuid().ToString();
            file.SaveAs(this.ScoFilePath + "\\" + guid + ".zip");

            using (var zip = ZipFile.Read(this.ScoFilePath + "\\" + guid + ".zip"))
            {
                Directory.CreateDirectory(this.ScoFilePath + "\\" + guid);
                zip.ExtractAll(this.ScoFilePath + "\\" + guid, ExtractExistingFileAction.OverwriteSilently);
            }

            if (!System.IO.File.Exists(this.ScoFilePath + "\\" + guid + "\\imsmanifest.xml"))
            {
                return this.Json(new
                {
                    error = "Загруженный файл не является объектом SCORM"
                });
            }

            System.IO.File.Delete(this.ScoFilePath + "\\" + guid + ".zip");

            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                repositoriesContainer.RepositoryFor<ScoObjects>().Save(new ScoObjects
                {
                    Name = name,
                    Path = guid,
                    Enabled = false,
                    IsDeleted = false
                });
                repositoriesContainer.ApplyChanges();
            }

            return this.Json(name, JsonRequestBehavior.AllowGet);
        }

        public ActionResult DeleteSco(string path)
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                var data = repositoriesContainer.RepositoryFor<ScoObjects>()
                    .GetBy(new Query<ScoObjects>(e => e.Path == path));
                data.IsDeleted = true;
                repositoriesContainer.RepositoryFor<ScoObjects>().Save(data);
                repositoriesContainer.ApplyChanges();
            }

            return this.Json(path, JsonRequestBehavior.AllowGet);
        }

        public ActionResult ViewSco(string path)
        {
            var fileImsmanifestPath = this.ScoFilePath + "\\" + path + "\\" + "imsmanifest.xml";
            var scorm = new Scorm();
            var fileXml = new FileInfo(fileImsmanifestPath);
            scorm.OpenImsManifest(fileXml);
            return this.Json(scorm.TreeActivity, JsonRequestBehavior.AllowGet);
        }

        public ActionResult EditObject(string name, string path)
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                var data = repositoriesContainer.RepositoryFor<ScoObjects>()
                    .GetBy(new Query<ScoObjects>(e => e.Path == path));
                data.Name = name;
                repositoriesContainer.RepositoryFor<ScoObjects>().Save(data);
                repositoriesContainer.ApplyChanges();
            }

            return this.Json(name, JsonRequestBehavior.AllowGet);
        }

        public ActionResult UpdateObjects(bool enable, string path)
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                var data = repositoriesContainer.RepositoryFor<ScoObjects>()
                    .GetBy(new Query<ScoObjects>(e => e.Path == path));
                data.Enabled = enable;
                repositoriesContainer.RepositoryFor<ScoObjects>().Save(data);
                repositoriesContainer.ApplyChanges();
            }

            return this.Json(enable, JsonRequestBehavior.AllowGet);
        }
    }
}