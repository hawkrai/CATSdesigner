using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web.Mvc;
using Application.Core;
using Application.Core.Helpers;
using Application.Core.UI.Controllers;
using Application.Core.UI.HtmlHelpers;
using Application.Infrastructure;
using Application.Infrastructure.FilesManagement;
using Application.Infrastructure.PracticalManagement;
using Application.Infrastructure.SubjectManagement;
using Ionic.Zip;
using LMPlatform.Data.Repositories;
using LMPlatform.Models;
using LMPlatform.UI.Attributes;
using LMPlatform.UI.ViewModels.SubjectViewModels;
using Mvc.JQuery.Datatables;
using WebMatrix.WebData;

namespace LMPlatform.UI.Controllers
{
    [JwtAuth(Roles = "student, lector")]
    public class SubjectController : BasicController
    {
        private readonly LazyDependency<IFilesManagementService> filesManagementService =
            new LazyDependency<IFilesManagementService>();

        private readonly LazyDependency<ISubjectManagementService> subjectManagementService =
            new LazyDependency<ISubjectManagementService>();

        private readonly LazyDependency<IPracticalManagementService> practicalManagementService =
            new LazyDependency<IPracticalManagementService>();

        public IFilesManagementService FilesManagementService => filesManagementService.Value;

        public ISubjectManagementService SubjectManagementService => subjectManagementService.Value;
        public IPracticalManagementService PracticalManagementService => practicalManagementService.Value;


        public ActionResult GetFileSubject(string subjectId)
        {
            var lectures = new List<Attachment>();
            foreach (var att in this.SubjectManagementService.GetLecturesAttachments(int.Parse(subjectId)))
                lectures.AddRange(FilesManagementService.GetAttachments(att).ToList());

            var labs = new List<Attachment>();
            foreach (var att in this.SubjectManagementService.GetLabsAttachments(int.Parse(subjectId)))
                lectures.AddRange(this.FilesManagementService.GetAttachments(att).ToList());

            var practicals = new List<Attachment>();
            foreach (var att in this.PracticalManagementService.GetPracticalsAttachments(int.Parse(subjectId)))
                lectures.AddRange(this.FilesManagementService.GetAttachments(att).ToList());

            return new JsonResult
            {
                Data = new
                {
                    Lectures = lectures,
                    Labs = labs,
                    Practicals = practicals
                },
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult GetFileSubjectV2(int subjectId)
        {
            var attachements = SubjectManagementService.GetSubjectAttachments(subjectId);
            return new JsonResult
            {
                Data = new
                {
                    Attachment = attachements
                    .Where(att => !string.IsNullOrEmpty(att))
                    .Select(att => FilesManagementService.GetAttachments(att))
                    .Where(att => att.Count > 0)
                    .Aggregate((acc, x) => acc.Concat(x).ToList())
                },
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }


        [AllowAnonymous]
        public ActionResult GetFileSubjectJson(string subjectId)
        {
            var lectures = new List<Attachment>();
            foreach (var att in this.SubjectManagementService.GetLecturesAttachments(int.Parse(subjectId)))
                lectures.AddRange(this.FilesManagementService.GetAttachments(att).ToList());

            var labs = new List<Attachment>();
            foreach (var att in this.SubjectManagementService.GetLabsAttachments(int.Parse(subjectId)))
                lectures.AddRange(this.FilesManagementService.GetAttachments(att).ToList());

            var practicals = new List<Attachment>();
            foreach (var att in this.PracticalManagementService.GetPracticalsAttachments(int.Parse(subjectId)))
                lectures.AddRange(this.FilesManagementService.GetAttachments(att).ToList());

            return new JsonResult
            {
                Data = new
                {
                    Lectures = lectures,
                    Labs = labs,
                    Practicals = practicals
                },
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult Index(int subjectId)
        {
            if (this.SubjectManagementService.IsWorkingSubject(UserContext.CurrentUserId, subjectId))
            {
                var model = new SubjectWorkingViewModel(subjectId);
                return JsonResponse(model);
            }

            if (this.User.IsInRole("student"))
            {
                var model = new SubjectWorkingViewModel(subjectId);
                return JsonResponse(model);
            }

            return StatusCode(HttpStatusCode.BadRequest);
        }

        public ActionResult Create()
        {
            var model = new SubjectEditViewModel(0);
            return JsonResponse(model);
        }

        public ActionResult EditSubject(int id)
        {
            var model = new SubjectEditViewModel(id);
            return JsonResponse(model);
        }

        public ActionResult DeleteSubject(int id)
        {
            this.SubjectManagementService.DeleteSubject(id);
            return null;
        }

        [HttpPost]
        public ActionResult SaveSubject(SubjectEditViewModel model)
        {
            var color = model.Color;
            var isNew = model.SubjectId == 0;
            if (color == "#ffffff")
            {
                var rnd = new Random();
                var random = rnd.Next(1, 4);
                color = random switch
                {
                    1 => "#0074D9",
                    2 => "#FF4136",
                    3 => "#FFDC00",
                    _ => "#85144b"
                };
            }

            model.Save(UserContext.CurrentUserId, color);
            return Json(new {
                Message = isNew ? "Предмет успешно добавлен" : "Предмет успешно отредактирован",
                Code = "200"
            });
        }

        public ActionResult GetFileLectures(int id)
        {
            if (id == 0) return JsonResponse(new List<Attachment>());
            var model = this.SubjectManagementService.GetLectures(id);
            return JsonResponse(this.FilesManagementService.GetAttachments(model.Attachments).ToList());
        }

        public ActionResult GetFileLabs(int id)
        {
            if (id == 0) return JsonResponse(new List<Attachment>());
            var model = this.SubjectManagementService.GetLabs(id);
            return JsonResponse(this.FilesManagementService.GetAttachments(model.Attachments).ToList());
        }

        public ActionResult GetUserFilesLab(int id)
        {
            if (id == 0) return JsonResponse(new List<Attachment>());
            var model = this.SubjectManagementService.GetUserLabFile(id);
            return JsonResponse(this.FilesManagementService.GetAttachments(model.Attachments).ToList());
        }

        public ActionResult GetFilePracticals(int id)
        {
            if (id == 0) return JsonResponse(new List<Attachment>());
            var model = PracticalManagementService.GetPractical(id);
            return JsonResponse(this.FilesManagementService.GetAttachments(model.Attachments).ToList());
        }

        public FileResult GetZipLabs(int id, int subjectId)
        {
            var zip = new ZipFile(Encoding.UTF8);

            var groups = this.SubjectManagementService.GetGroup(id);
            var created = new List<string>();
            foreach (var group in groups.Students.Where(e => e.Confirmed == null || e.Confirmed.Value))
            {
                var model = this.SubjectManagementService.GetUserLabFiles(group.Id, subjectId).Where(e => e.IsReceived);

                var attachments = new List<Attachment>();

                foreach (var data in model)
                {
                    attachments.AddRange(this.FilesManagementService.GetAttachments(data.Attachments));
                }

                if (created.All(e => e != group.FullName.Replace(" ", "_")))
                {
                    UtilZip.CreateZipFile(ConfigurationManager.AppSettings["FileUploadPath"], zip, attachments,
                        group.FullName.Replace(" ", "_"));
                    created.Add(group.FullName.Replace(" ", "_"));
                }
            }

            var memoryStream = new MemoryStream();

            zip.Save(memoryStream);

            memoryStream.Seek(0, SeekOrigin.Begin);

            return new FileStreamResult(memoryStream, "application/zip") {FileDownloadName = groups.Name + ".zip"};
        }

        public FileResult GetStudentZipLabs(int id, int subjectId, int userId)
        {
            var zip = new ZipFile(Encoding.UTF8);

            var subGroups = this.SubjectManagementService.GetSubGroup(id);

            var subGroup = subGroups.SubjectStudents.FirstOrDefault(e => e.StudentId == userId);

            var model = this.SubjectManagementService.GetUserLabFiles(subGroup.StudentId, subjectId);

            var attachments = new List<Attachment>();

            foreach (var data in model)
                attachments.AddRange(this.FilesManagementService.GetAttachments(data.Attachments));

            UtilZip.CreateZipFile(ConfigurationManager.AppSettings["FileUploadPath"], zip, attachments,
                subGroup.Student.FullName.Replace(" ", "_"));

            var memoryStream = new MemoryStream();

            zip.Save(memoryStream);

            memoryStream.Seek(0, SeekOrigin.Begin);

            return new FileStreamResult(memoryStream, "application/zip")
                {FileDownloadName = subGroup.Student.FullName.Replace(" ", "_") + ".zip"};
        }

        [HttpPost]
        public FileResult GetAttachmentsAsZip(IEnumerable<int> attachmentsIds)
        {
            var zip = new ZipFile(Encoding.UTF8);
            var name = Guid.NewGuid().ToString();
            var attachments = FilesManagementService.GetAttachmentsByIds(attachmentsIds);
            UtilZip.CreateZipFile(ConfigurationManager.AppSettings["FileUploadPath"], zip, attachments.ToList(), name);

            var memoryStream = new MemoryStream();
            zip.Save(memoryStream);
            memoryStream.Seek(0, SeekOrigin.Begin);

            return new FileStreamResult(memoryStream, "application/zip")
            { FileDownloadName = name + ".zip" };
        }

        public ActionResult Subjects()
        {
            var model = new SubjectManagementViewModel(UserContext.CurrentUserId.ToString(CultureInfo.InvariantCulture));
            var subjects = model.Subjects;
            return JsonResponse(subjects);
        }

        public ActionResult GetSubjectsForCM()
        {
            var model = new SubjectManagementViewModel(
                UserContext.CurrentUserId.ToString(CultureInfo.InvariantCulture));
            var subjects = model.Subjects.Where(x => SubjectModuleRepository.GetCMSubjectIds().Contains(x.SubjectId))
                .ToList();
            return JsonResponse(subjects);
        }

        [HttpPost]
        public ActionResult GetModuleData(int subjectId, int moduleId)
        {
            var model = new ModulesDataWorkingViewModel(subjectId, moduleId);
            return JsonResponse(model);
        }

        [HttpPost]
        public ActionResult GetModuleDataSubMenu(int subjectId, int moduleId, ModuleType type)
        {
            var model = new ModulesDataWorkingViewModel(subjectId, moduleId, type);
            return JsonResponse(model);
        }

        public ActionResult SubGroups(int subjectId)
        {
            var model = new SubjectWorkingViewModel(subjectId);
            return JsonResponse(model.SubGroups);
        }

        [HttpPost]
        public ActionResult SubGroupsChangeGroup(string subjectId, string groupId)
        {
            var model = new SubjectWorkingViewModel(int.Parse(subjectId));
            return JsonResponse(model.SubGroup(int.Parse(groupId)));
        }

        [HttpPost]
        public ActionResult SaveSubGroup(string subjectId, string groupId, string subGroupFirstIds,
            string subGroupSecondIds, string subGroupThirdIds)
        {
            var model = new SubGroupEditingViewModel();
            model.SaveSubGroups(int.Parse(subjectId), int.Parse(groupId), subGroupFirstIds, subGroupSecondIds,
                subGroupThirdIds);
            return null;
        }



        [HttpPost]
        public DataTablesResult<SubjectListViewModel> GetSubjects(DataTablesParam dataTableParam)
        {
            var searchString = dataTableParam.GetSearchString();
            var subjects = this.ApplicationService<ISubjectManagementService>().GetSubjectsLecturer(
                UserContext.CurrentUserId, pageInfo: dataTableParam.ToPageInfo(), searchString: searchString);

            return DataTableExtensions.GetResults(subjects.Items.Select(this._GetSubjectRow), dataTableParam,
                subjects.TotalCount);
        }

        

        public SubjectListViewModel _GetSubjectRow(Subject subject)
        {
            return new SubjectListViewModel
            {
                Name = $"<a href=\"{this.Url.Action("Index", "Subject", new {subjectId = subject.Id})}\">{subject.Name}</a>",
                ShortName = subject.ShortName,
                Action = this.PartialViewToString("_SubjectActionList", new SubjectViewModel {SubjectId = subject.Id})
            };
        }

        public ActionResult IsAvailableSubjectName(string name, string id)
        {
            return this.Json(!this.SubjectManagementService.IsSubjectName(name, id, UserContext.CurrentUserId),
                JsonRequestBehavior.AllowGet);
        }

        public ActionResult IsAvailableSubjectShortName(string name, string id)
        {
            return this.Json(!this.SubjectManagementService.IsSubjectShortName(name, id, UserContext.CurrentUserId),
                JsonRequestBehavior.AllowGet);
        }
    }
}