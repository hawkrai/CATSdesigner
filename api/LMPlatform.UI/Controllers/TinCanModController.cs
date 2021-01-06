using System;
using System.Configuration;
using System.IO;
using System.Web;
using System.Web.Mvc;
using Application.Core;
using Application.Infrastructure.TinCanManagement;
using Ionic.Zip;
using LMPlatform.UI.Attributes;

namespace LMPlatform.UI.Controllers
{
    [JwtAuth]
    public class TinCanModController : Controller
    {
        private readonly LazyDependency<ITinCanManagementService> _tinCanManagementService =
            new LazyDependency<ITinCanManagementService>();

        public ITinCanManagementService TinCanManagementService => this._tinCanManagementService.Value;

        public string TinCanFilePath => ConfigurationManager.AppSettings["TinCanFilePath"];

        public ActionResult GetObjects()
        {
            return this.Json(this.TinCanManagementService.GetAllTinCanObjects(), JsonRequestBehavior.AllowGet);
        }

        public ActionResult LoadObject(string name, HttpPostedFileBase file)
        {
            var guid = Guid.NewGuid().ToString();
            file.SaveAs(this.TinCanFilePath + "\\" + guid + ".zip");

            using (var zip = ZipFile.Read(this.TinCanFilePath + "\\" + guid + ".zip"))
            {
                Directory.CreateDirectory(this.TinCanFilePath + "\\" + guid);
                zip.ExtractAll(this.TinCanFilePath + "\\" + guid, ExtractExistingFileAction.OverwriteSilently);
            }

            if (!System.IO.File.Exists(this.TinCanFilePath + "\\" + guid + "\\tincan.xml"))
            {
                return this.Json(new
                {
                    error = "Загруженный файл не является объектом TinCan"
                });
            }

            System.IO.File.Delete(this.TinCanFilePath + "\\" + guid + ".zip");

            this.TinCanManagementService.SaveTinCanObject(name, guid);

            return this.Json(name, JsonRequestBehavior.AllowGet);

        }

        public ActionResult DeleteTinCan(int id)
        {
            this.TinCanManagementService.DeleteTinCanObject(id);
            return this.Json(id, JsonRequestBehavior.AllowGet);
        }

        public ActionResult ViewTinCan(int id)
        {
            return this.Json(this.TinCanManagementService.ViewTinCanObject(this.TinCanFilePath, id),
                JsonRequestBehavior.AllowGet);
        }

        public ActionResult EditObject(string name, string path)
        {
            this.TinCanManagementService.EditTinCanObject(name, path);
            return this.Json(name, JsonRequestBehavior.AllowGet);
        }

        public ActionResult UpdateObjects(bool enable, int id)
        {
            this.TinCanManagementService.UpdateTinCanObject(enable, id);
            return this.Json(enable, JsonRequestBehavior.AllowGet);
        }
    }
}