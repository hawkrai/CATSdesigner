using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Net;
using System.Text;
using System.Web.Mvc;
using Application.Core;
using Application.Core.Data;
using Application.Core.Helpers;
using Application.Core.UI.Controllers;
using Application.Infrastructure.CPManagement;
using Application.Infrastructure.DPManagement;
using Application.Infrastructure.FilesManagement;
using Application.Infrastructure.ProjectManagement;
using Application.Infrastructure.SubjectManagement;
using Application.Infrastructure.UserManagement;
using LMPlatform.Data.Infrastructure;
using LMPlatform.Models;
using LMPlatform.UI.Attributes;
using LMPlatform.UI.Services.Modules.News;
using LMPlatform.UI.Services.Modules.Subjects;
using LMPlatform.UI.ViewModels.AdministrationViewModels;
using LMPlatform.UI.ViewModels.LmsViewModels;

namespace LMPlatform.UI.Controllers
{
    [JwtAuth]
    public class ProfileController : BasicController
    {
        private readonly LazyDependency<ICPManagementService> _cpManagementService =
            new LazyDependency<ICPManagementService>();

        private readonly LazyDependency<IDpManagementService> _diplomProjectManagementService =
            new LazyDependency<IDpManagementService>();

        private readonly LazyDependency<IProjectManagementService> projectManagementService =
            new LazyDependency<IProjectManagementService>();

        private readonly LazyDependency<ISubjectManagementService> subjectManagementService =
            new LazyDependency<ISubjectManagementService>();
        private ISubjectManagementService SubjectManagementService => this.subjectManagementService.Value;
        private ICPManagementService CpManagementService => this._cpManagementService.Value;

        private IDpManagementService DpManagementService => this._diplomProjectManagementService.Value;

        private IProjectManagementService ProjectManagementService => this.projectManagementService.Value;

        public IUsersManagementService UsersManagementService => this.ApplicationService<IUsersManagementService>();

        public ActionResult Page(string userLogin = "")
        {
            if (this.User.IsInRole("lector") || this.User.IsInRole("student"))
            {
                var user = this.UsersManagementService.GetUser(userLogin);

                var model = new LmsViewModel(user.Id, user.Lecturer != null)
                {
                    UserActivity = new UserActivityViewModel()
                };

                this.ViewBag.ShowDpSectionForUser =
                    this.DpManagementService.ShowDpSectionForUser(UserContext.CurrentUserId);

                this.ViewData["userName"] = string.IsNullOrEmpty(userLogin) || UserContext.CurrentUserName == userLogin
                    ? UserContext.CurrentUserName
                    : userLogin;

                return JsonResponse(model);
            }

            if (this.User.IsInRole("admin"))
            {
                var model = new LmsViewModel(UserContext.CurrentUserId, this.User.IsInRole("lector"))
                {
                    UserActivity = new UserActivityViewModel()
                };
                this.ViewData["userName"] = string.IsNullOrEmpty(userLogin) || UserContext.CurrentUserName == userLogin
                    ? UserContext.CurrentUserName
                    : userLogin;

                return JsonResponse(model);
            }

            return StatusCode(HttpStatusCode.BadRequest);
        }

        [HttpPost]
        public ActionResult GetProfileStatistic(string userLogin)
        {
            var userService = new UsersManagementService();

            var subjectService = new SubjectManagementService();

            var user = userService.GetUser(userLogin);

            var labs = 0;
            var lects = 0;

            if (user.Lecturer == null)
                labs = subjectService.LabsCountByStudent(user.Id);
            else
                labs = subjectService.LabsCountByLector(user.Id);

            return this.Json(new
            {
                Labs = labs,
                Lects = lects
            });
        }

        [HttpPost]
        public ActionResult GetProfileInfoCalendar(string userLogin)
        {
            var userService = new UsersManagementService();

            var subjectService = new SubjectManagementService();

            var user = userService.GetUser(userLogin);

            var labsEvents = new List<ProfileCalendarViewModel>();
            var lectEvents = new List<ProfileCalendarViewModel>();

            if (user.Lecturer == null)
            {
                labsEvents = subjectService.GetGroupsLabEvents(user.Student.GroupId, user.Id).Select(
                    e => new ProfileCalendarViewModel
                        {color = e.Color, title = e.Title, start = e.Start, subjectId = e.SubjectId}).ToList();

                lectEvents =
                    subjectService.GetLecturesEvents(user.Student.GroupId, user.Id)
                        .Select(e => new ProfileCalendarViewModel
                            {color = e.Color, title = e.Title, start = e.Start, subjectId = e.SubjectId})
                        .ToList();
            }
            else
            {
                labsEvents =
                    subjectService.GetLabEvents(user.Id)
                        .Select(e => new ProfileCalendarViewModel
                            {color = e.Color, title = e.Title, start = e.Start, subjectId = e.SubjectId})
                        .ToList();

                lectEvents =
                    subjectService.GetLecturesEvents(user.Id)
                        .Select(e => new ProfileCalendarViewModel
                            {color = e.Color, title = e.Title, start = e.Start, subjectId = e.SubjectId})
                        .ToList();
            }

            return this.Json(new
            {
                Labs = labsEvents,
                Lect = lectEvents
            });
        }

        [HttpPost]
        public ActionResult GetProfileInfoSubjects(string userLogin, bool isArchive = false)
        {
            var userService = new UsersManagementService();

            var subjectService = new SubjectManagementService();

            var user = userService.GetUser(userLogin);

            List<Subject> model;

            if (user.Lecturer == null)
                model = subjectService.GetSubjectsByStudent(user.Id, isArchive);
            else
                model = subjectService.GetSubjectsByLector(user.Id, isArchive);


            var returnModel = new List<object>();

            foreach (var subject in model)
                returnModel.Add(new
                {
                    subject.Name,
                    subject.Id,
                    subject.ShortName,
                    subject.Color,
                    Completing = subjectService.GetSubjectCompleting(subject.Id, user.Lecturer != null ? "L" : "S",
                        user.Student)
                });

            return this.Json(returnModel);
        }

        [HttpGet]
        public ActionResult GetProfileInfoSubjectsById(int id)
        {
            var userService = this.UsersManagementService;
            var subjectService = this.SubjectManagementService;
            var user = userService.GetUserById(id);
            List<Subject> model;

            if (user.Lecturer == null)
            {
                model = subjectService.GetSubjectsByStudent(user.Id);
            }
            else
            {
                model = subjectService.GetSubjectsByLector(user.Id);
            }

            var returnModel = new List<object>();

            foreach (var subject in model)
                returnModel.Add(new
                {
                    subject.Name,
                    subject.Id,
                    subject.ShortName,
                    subject.Color,
                    Completing = subjectService.GetSubjectCompleting(subject.Id, user.Lecturer != null ? "L" : "S",
                        user.Student)
                });

            return this.Json(returnModel, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult GetAllProfileInfoSubjectsById(int id)
        {
            var userService = this.UsersManagementService;
            var subjectService = this.SubjectManagementService;
            var user = userService.GetUserById(id);
            List<Subject> model;

            if (user.Lecturer == null)
            {
                model = subjectService.GetSubjectsInfoByStudent(user.Id);
            }
            else
            {
                model = subjectService.GetSubjectsInfoByLector(user.Id);
            }

            var returnModel = new List<object>();

            foreach (var subject in model)
                returnModel.Add(new
                {
                    subject.Name,
                    subject.Id,
                    subject.ShortName,
                    subject.Color,
                    Completing = "2",/*subjectService.GetSubjectCompleting(subject.Id, user.Lecturer != null ? "L" : "S",
                        user.Student),*/
                    IsActive = subject.SubjectGroups.FirstOrDefault(sg => sg.SubjectId == subject.Id).IsActiveOnCurrentGroup
                }) ;

            return this.Json(returnModel, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult GetProfileInfoById(int id)
        {
            var model = new ProfileVewModel();
            var service = this.UsersManagementService;
            var user = service.GetUserById(id);

            model.UserType = user.Lecturer != null ? "1" : "2";
            model.Avatar = user.Avatar;
            model.SkypeContact = user.SkypeContact;
            model.Email = user.Email;
            model.Phone = user.Phone;
            model.About = user.About;
            model.Id = user.Id;
            model.Login = user.UserName;
            if (user.AttendanceList.Any())
            {
                model.LastLogitData = user.AttendanceList.LastOrDefault().ToString("dd/MM/yyyy HH:mm:ss");
            }
            else {
                model.LastLogitData = "-";
            }
            if (user.Lecturer != null)
            {
                model.Name = user.Lecturer.LastName + " " + user.Lecturer.FirstName + " " + user.Lecturer.MiddleName;
                model.Skill = user.Lecturer.Skill;
            }
            else if(user.Student != null)
            {
                model.Name = user.Student.LastName + " " + user.Student.FirstName + " " + user.Student.MiddleName;
                var course = int.Parse(DateTime.Now.Year.ToString()) - int.Parse(user.Student.Group.StartYear);
                if (DateTime.Now.Month >= 9) course += 1;

                model.Skill = course > 5 ? "Окончил (-а)" : course + " курс";

                model.Group = user.Student.Group.Name;
                model.GroupId = user.Student.Group.Id;
            }

            return this.Json(model, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult GetUserProjectsById(int id)
        {
            var service = this.UsersManagementService;
            var user = service.GetUserById(id);
            var project = this.ProjectManagementService.GetProjectsOfUser(user.Id);

            return this.Json(project.Select(e => new
            {
                Name = e.Project.Title
            }), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult GetDpUserProjectsById(int id)
        {
            var dpProject = this.DpManagementService.GetProjectsByUserId(id);

            return this.Json(dpProject.Select(e => new
            {
                Name = e.Theme
            }), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult GetCpUserProjectsById(int id)
        {
            var cpProject = this.CpManagementService.GetProjectsByUserId(id);

            return this.Json(cpProject.Select(e => new
            {

                Name = e.Theme,
                SubjectName = e.Subject
            }), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult GetProfileInfo(string userLogin)
        {
            var model = new ProfileVewModel();

            var service = new UsersManagementService();

            var user = service.GetUser(userLogin);

            model.UserType = user.Lecturer != null ? "1" : "2";
            model.Avatar = user.Avatar;
            model.SkypeContact = user.SkypeContact;
            model.Email = user.Email;
            model.Phone = user.Phone;
            model.About = user.About;
            model.Id = user.Id;
            model.LastLogitData = user.AttendanceList.LastOrDefault().ToString("dd/MM/yyyy HH:mm:ss");
            if (user.Lecturer != null)
            {
                model.Name = user.Lecturer.LastName + " " + user.Lecturer.FirstName + " " + user.Lecturer.MiddleName;
                model.Skill = user.Lecturer.Skill;
            }
            else
            {
                model.Name = user.Student.LastName + " " + user.Student.FirstName + " " + user.Student.MiddleName;
                var course = int.Parse(DateTime.Now.Year.ToString()) - int.Parse(user.Student.Group.StartYear);
                if (DateTime.Now.Month >= 9) course += 1;

                model.Skill = course > 5 ? "Окончил (-а)" : course + " курс";

                model.Group = user.Student.Group.Name;
                model.GroupId = user.Student.Group.Id;
            }


            return this.Json(model);
        }

        [HttpPost]
        public ActionResult GetUserProject(string userLogin)
        {
            var service = new UsersManagementService();

            var user = service.GetUser(userLogin);
            var project = this.ProjectManagementService.GetProjectsOfUser(user.Id);

            return this.Json(project.Select(e => new
            {
                Name = e.Project.Title
            }));
        }

        //[HttpPost]
        //public ActionResult GetStudentAttendance(string userLogin)
        //{
        //    var service = new UsersManagementService();

        //    var user = service.GetUser(userLogin);

        //    if (user.Lecturer != null)
        //    {
        //        return null;
        //    }

        //    var subjectService = new SubjectManagementService();

        //    var attendance = subjectService.StudentAttendance(user.Id);
        //}

        [HttpGet]
        public ActionResult GetAccessCode()
        {
            var repository = new RepositoryBase<LmPlatformModelsContext, AccessCode>(new LmPlatformModelsContext());

            var code = repository.GetAll().OrderBy(e => e.Id).ToList().LastOrDefault();

            return this.Json(code != null ? code.Number : string.Empty, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult GenerateCode()
        {
            var repository = new RepositoryBase<LmPlatformModelsContext, AccessCode>(new LmPlatformModelsContext());

            var model = new AccessCode
            {
                Date = DateTime.Now,
                Number = this.RandomString(10, false)
            };

            repository.Save(model);

            return this.Json(model.Number, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        ///     Generates random strings with a given length
        /// </summary>
        /// <param name="size">Size of the string</param>
        /// <param name="lowerCase">If true, generate lowercase string</param>
        /// <returns>Random string</returns>
        private string RandomString(int size, bool lowerCase)
        {
            var builder = new StringBuilder();
            var random = new Random();
            char ch;
            for (var i = 1; i < size + 1; i++)
            {
                ch = Convert.ToChar(Convert.ToInt32(Math.Floor(26 * random.NextDouble() + 65)));
                builder.Append(ch);
            }

            if (lowerCase)
                return builder.ToString().ToLower();
            return builder.ToString();
        }

        [HttpPost]
        public ActionResult GetNews(string userLogin)
        {
            var service = new UsersManagementService();

            var subjectService = new SubjectManagementService();

            var user = service.GetUser(userLogin);

            var news = new List<SubjectNews>();

            if (user.Lecturer != null)
                news = subjectService.GetNewsByLector(user.Id);
            else
                news = subjectService.GetNewsByGroup(user.Student.GroupId);

            var filesService = new FilesManagementService();

            return this.Json(news.OrderByDescending(e => e.EditDate).Select(x => new ProfileNews {
                Body = x.Body,
                Id = x.Id,
                Title = x.Title,
                SubjectId = x.SubjectId,
                EditDate = x.EditDate,
                Disabled = x.Disabled,
                Subject = x.Subject != null ? new ProfileSubject
                {
                    Id = x.SubjectId,
                    Color = x.Subject.Color,
                    Name = x.Subject.Name,
                    ShortName = x.Subject.ShortName
                } : null,
                Attachments = string.IsNullOrEmpty(x.Attachments) ? new List<Attachment>() : filesService.GetAttachments(x.Attachments)
        }).ToList());
        }

        [HttpPost]
        public ActionResult GetMiniInfoCalendar(string userLogin)
        {
            var userService = new UsersManagementService();

            var subjectService = new SubjectManagementService();

            var user = userService.GetUser(userLogin);

            var labsEvents =
                subjectService.GetLabEvents(user.Id)
                    .Select(e => new ProfileCalendarViewModel {color = e.Color, title = e.Title, start = e.Start})
                    .ToList();

            var lectEvents =
                subjectService.GetLecturesEvents(user.Id)
                    .Select(e => new ProfileCalendarViewModel {color = e.Color, title = e.Title, start = e.Start})
                    .ToList();

            return this.Json(new
            {
                Labs = labsEvents,
                Lect = lectEvents
            });
        }
    }
}