using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Mvc;
using Application.Core;
using Application.Infrastructure.CPManagement;
using Application.Infrastructure.Export;
using Application.Infrastructure.FilesManagement;
using Application.Infrastructure.SubjectManagement;
using LMPlatform.Data.Infrastructure;
using LMPlatform.Models;
using LMPlatform.UI.ViewModels.SubjectViewModels;
using Newtonsoft.Json;
using WebMatrix.WebData;

namespace LMPlatform.UI.Controllers
{
    public class CpController : Controller
    {
        private readonly LazyDependency<ICPManagementService> _cpManagementService =
            new LazyDependency<ICPManagementService>();

        private readonly LazyDependency<IModulesManagementService> _modulesManagementService =
            new LazyDependency<IModulesManagementService>();

        private readonly LazyDependency<ISubjectManagementService> _subjectManagementService =
            new LazyDependency<ISubjectManagementService>();

        private readonly LazyDependency<IFilesManagementService> filesManagementService =
            new LazyDependency<IFilesManagementService>();

        private ICPManagementService CpManagementService => this._cpManagementService.Value;

        public IFilesManagementService FilesManagementService => this.filesManagementService.Value;

        public ISubjectManagementService SubjectManagementService => this._subjectManagementService.Value;

        public IModulesManagementService ModulesManagementService => this._modulesManagementService.Value;

        public ActionResult Subjects(int subjectId)
        {
            var s = this.SubjectManagementService.GetUserSubjects(WebSecurity.CurrentUserId).Where(e => !e.IsArchive);
            var courseProjectSubjects = s.Where(cs =>
                    this.ModulesManagementService.GetModules(cs.Id).Any(m => m.ModuleType == ModuleType.YeManagment))
                .Select(e => new SubjectViewModel(e)).ToList();
            return this.Json(courseProjectSubjects, JsonRequestBehavior.AllowGet);
        }

        [System.Web.Http.HttpGet]
        public void GetTasksSheetDocument(int courseProjectId)
        {
            var courseProject =
                new LmPlatformModelsContext().CourseProjects
                    .Include(x =>
                        x.AssignedCourseProjects.Select(y => y.Student.Group.Secretary.CoursePercentagesGraphs))
                    .Single(x => x.CourseProjectId == courseProjectId);

            string docName;
            if (courseProject.AssignedCourseProjects.Count == 1)
            {
                var stud = courseProject.AssignedCourseProjects.Single().Student;
                docName = $"{stud.LastName}_{stud.FirstName}";
            }
            else
            {
                docName = $"{courseProject.Theme}";
            }

            WordCourseProject.CourseProjectToWord(docName, courseProject, this.Response);
        }

        [System.Web.Http.HttpGet]
        public void GetZipTaskSheet(int id, int subjectId)
        {
            var courseProjects = new LmPlatformModelsContext().CourseProjects
                                .Where(x => x.SubjectId == subjectId)
                                .Where(x => x.AssignedCourseProjects.Count() == 1)
                                .Include(x =>
                        x.AssignedCourseProjects.Select(y => y.Student.Group.Secretary.CoursePercentagesGraphs))
                                .Where(x => x.AssignedCourseProjects.FirstOrDefault().Student.GroupId == id);

            string fileName = "NoGroup";
            if (courseProjects.Count() > 0)
            {
                fileName = courseProjects.FirstOrDefault().AssignedCourseProjects.FirstOrDefault().Student.Group.Name;
                WordCourseProject.CourseProjectsToArchive(fileName, courseProjects, this.Response);
            }
            else
            {
                WordCourseProject.CourseProjectsToArchive(fileName, courseProjects, this.Response);
            }

        }

        [System.Web.Http.HttpPost]
        public void DisableNews(string subjectId)
        {
            this.CpManagementService.DisableNews(int.Parse(subjectId), true);
        }

        [System.Web.Http.HttpPost]
        public void EnableNews(string subjectId)
        {
            this.CpManagementService.DisableNews(int.Parse(subjectId), false);
        }

        [System.Web.Http.HttpGet]
        public string GetTasksSheetHtml(int courseProjectId)
        {
            //todo
            var courseProject =
                new LmPlatformModelsContext().CourseProjects
                    .Include(x => x.AssignedCourseProjects.Select(y => y.Student.Group))
                    //.Include(x=>x.Lecturer.CoursePercentagesGraphs)
                    //.Include(x => x.AssignedCourseProjects.Select(y => y.Student.Group.Secretary.CoursePercentagesGraphs))
                    .Single(x => x.CourseProjectId == courseProjectId);

            return courseProject.AssignedCourseProjects.Count == 1
                ? WordCourseProject.CourseProjectToDocView(courseProject.AssignedCourseProjects.First())
                : WordCourseProject.CourseProjectToDocView(courseProject);
        }

        [System.Web.Http.HttpPost]
        public JsonResult SaveNews(string subjectId, string id, string title, string body, string disabled,
            string isOldDate, string pathFile, string attachments)
        {
            var attachmentsModel = JsonConvert.DeserializeObject<List<Attachment>>(attachments).ToList();
            var subject = int.Parse(subjectId);
            try
            {
                this.CpManagementService.SaveNews(new CourseProjectNews
                {
                    SubjectId = subject,
                    Id = int.Parse(id),
                    Attachments = pathFile,
                    Title = title,
                    Body = body,
                    Disabled = bool.Parse(disabled),
                    EditDate = DateTime.Now
                }, attachmentsModel, WebSecurity.CurrentUserId);
                return new JsonResult
                {
                    Data = new
                    {
                        Message = "Новость успешно сохранена",
                        Error = false
                    }
                };
            }
            catch (Exception)
            {
                return new JsonResult
                {
                    Data = new
                    {
                        Message = "Произошла ошибка при сохранении новости",
                        Error = true
                    }
                };
            }
        }
    }
}