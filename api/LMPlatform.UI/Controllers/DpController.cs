using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Mvc;
using Application.Core;
using Application.Core.Helpers;
using Application.Infrastructure.DPManagement;
using Application.Infrastructure.Export;
using Application.Infrastructure.FilesManagement;
using LMPlatform.Data.Infrastructure;
using LMPlatform.Models;
using LMPlatform.UI.Attributes;
using Newtonsoft.Json;
using WebMatrix.WebData;

namespace LMPlatform.UI.Controllers
{
    [JwtAuth]
    public class DpController : Controller
    {
        private readonly LazyDependency<IDpManagementService> _dpManagementService =
            new LazyDependency<IDpManagementService>();

        private readonly LazyDependency<IFilesManagementService> filesManagementService =
            new LazyDependency<IFilesManagementService>();

        public IFilesManagementService FilesManagementService => this.filesManagementService.Value;

        private IDpManagementService DpManagementService => this._dpManagementService.Value;

        [System.Web.Http.HttpPost]
        public void DisableNews()
        {
            this.DpManagementService.DisableNews(UserContext.CurrentUserId, true);
        }

        [System.Web.Http.HttpPost]
        public void EnableNews()
        {
            this.DpManagementService.DisableNews(UserContext.CurrentUserId, false);
        }

        public ActionResult GetFileNews(int id)
        {
            if (id == 0) return this.Json(new List<Attachment>(), JsonRequestBehavior.AllowGet);
            var model = this.DpManagementService.GetNews(id);
            return this.Json(this.FilesManagementService.GetAttachments(model.Attachments).ToList(), JsonRequestBehavior.AllowGet);
        }

        [System.Web.Http.HttpPost]
        public JsonResult SaveNews(string id, string title, string body, string disabled,
            string isOldDate, string pathFile, string attachments)
        {
            var attachmentsModel = JsonConvert.DeserializeObject<List<Attachment>>(attachments).ToList();

            try
            {
                this.DpManagementService.SaveNews(new DiplomProjectNews
                {
                    LecturerId = UserContext.CurrentUserId,
                    Id = int.Parse(id),
                    Attachments = pathFile,
                    Title = title,
                    Body = body,
                    Disabled = bool.Parse(disabled),
                    EditDate = DateTime.Now
                }, attachmentsModel, UserContext.CurrentUserId);
                return new JsonResult
                {
                    Data = new
                    {
                        Message = "Новость успешно сохранена",
                        Error = false
                    }
                };
            }
            catch (Exception e)
            {
                return new JsonResult
                {
                    Data = new
                    {
                        Message = "Произошла ошибка при сохранении новости",
                        Error = e.InnerException.InnerException.Message
                    }
                };
            }
        }

        public void GetTasksSheetDocument(int diplomProjectId)
        {
            //todo
            var diplomProject =
                new LmPlatformModelsContext().DiplomProjects
                    .Include(x =>
                        x.AssignedDiplomProjects.Select(y => y.Student.Group.Secretary.DiplomPercentagesGraphs))
                    .Single(x => x.DiplomProjectId == diplomProjectId);

            string docName;
            if (diplomProject.AssignedDiplomProjects.Count == 1)
            {
                var stud = diplomProject.AssignedDiplomProjects.Single().Student;
                docName = $"{stud.LastName}_{stud.FirstName}";
            }
            else
            {
                docName = $"{diplomProject.Theme}";
            }

            //Word.DiplomProjectToWord(docName, diplomProject, this.Response);
        }

        public string GetTasksSheetHtml(int diplomProjectId)
        {
            //todo
            var diplomProject =
                new LmPlatformModelsContext().DiplomProjects
                    .Include(x =>
                        x.AssignedDiplomProjects.Select(y => y.Student.Group.Secretary.DiplomPercentagesGraphs))
                    .Single(x => x.DiplomProjectId == diplomProjectId);

            return diplomProject.AssignedDiplomProjects.Count == 1
                ? Word.DiplomProjectToDocView(diplomProject.AssignedDiplomProjects.First())
                : Word.DiplomProjectToDocView(diplomProject);
        }
    }
}