﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Mvc;
using System.Web.Security;
using Application.Core.UI.Controllers;
using Application.Core.UI.HtmlHelpers;
using Application.Infrastructure.DPManagement;
using Application.Infrastructure.GroupManagement;
using Application.Infrastructure.LecturerManagement;
using Application.Infrastructure.StudentManagement;
using Application.Infrastructure.SubjectManagement;
using Application.Infrastructure.UserManagement;
using LMPlatform.UI.Attributes;
using LMPlatform.UI.ViewModels.AccountViewModels;
using LMPlatform.UI.ViewModels.AdministrationViewModels;
using Mvc.JQuery.Datatables;

namespace LMPlatform.UI.Controllers
{
    [JwtAuth(Roles = "admin")]
    public class AdministrationController : BasicController
    {
        [HttpPost]
        public DataTablesResult<StudentViewModel> GetCollectionStudents(DataTablesParam dataTableParam)
        {
            try
            {
                var searchString = dataTableParam.GetSearchString();
                this.ViewBag.Profile = "/Administration/Profile";
                this.ViewBag.ListOfSubject = "/Administration/ListOfSubject";
                this.ViewBag.EditActionLink = "/Administration/EditStudent";
                this.ViewBag.DeleteActionLink = "/Administration/DeleteStudent";
                this.ViewBag.StatActionLink = "/Administration/Attendance";
                var students = this.StudentManagementService.GetStudentsPageable(pageInfo: dataTableParam.ToPageInfo(),
                    searchString: searchString);
                this.SetupSettings(dataTableParam);
                return DataTableExtensions.GetResults(
                    students.Items.Select(s =>
                        StudentViewModel.FromStudent(s, this.PartialViewToString("_EditGlyphLinks", s.Id))),
                    dataTableParam, students.TotalCount);
            }
            catch (Exception e)
            {
                return DataTableExtensions.GetResults(
                    new List<StudentViewModel> {new StudentViewModel {Login = e.StackTrace}}, dataTableParam, 1);
            }
        }

        [HttpPost]
        public DataTablesResult<LecturerViewModel> GetCollectionLecturers(DataTablesParam dataTableParam)
        {
            var searchString = dataTableParam.GetSearchString();
            this.ViewBag.Profile = "/Administration/Profile";
            this.ViewBag.ListOfSubject = "/Administration/ListOfGroups";
            this.ViewBag.EditActionLink = "/Administration/EditProfessor";
            this.ViewBag.DeleteActionLink = "/Administration/DeleteLecturer";
            this.ViewBag.StatActionLink = "/Administration/Attendance";
            var lecturers = this.LecturerManagementService.GetLecturersPageable(pageInfo: dataTableParam.ToPageInfo(),
                searchString: searchString);
            this.SetupSettings(dataTableParam);
            return DataTableExtensions.GetResults(
                lecturers.Items.Select(l =>
                    LecturerViewModel.FormLecturers(l, this.PartialViewToString("_EditGlyphLinks", l.Id, l.IsActive))),
                dataTableParam, lecturers.TotalCount);
        }

        [HttpPost]
        public DataTablesResult<GroupViewModel> GetCollectionGroups(DataTablesParam dataTableParam)
        {
            var searchString = dataTableParam.GetSearchString();
            this.ViewBag.ListOfStudents = "/Administration/ListOfStudents";
            this.ViewBag.EditActionLink = "/Administration/EditGroup";
            this.ViewBag.DeleteActionLink = "/Administration/DeleteGroup";
            var groups = this.GroupManagementService.GetGroupsPageable(pageInfo: dataTableParam.ToPageInfo(),
                searchString: searchString);
            this.SetupSettings(dataTableParam);
            return DataTableExtensions.GetResults(
                groups.Items.Select(g =>
                    GroupViewModel.FormGroup(g, this.PartialViewToString("_EditGlyphLinks", g.Id))), dataTableParam,
                groups.TotalCount);
        }

        private void SetupSettings(DataTablesParam dataTableParam)
        {
            var n = 20;

            for (var i = 0; i < n; i++)
            {
                if (string.IsNullOrEmpty(this.HttpContext.Request.Form["iSortCol_" + i])) return;

                dataTableParam.iSortCol.Add(int.Parse(this.HttpContext.Request.Form["iSortCol_" + i]));
                dataTableParam.sSortDir.Add(this.HttpContext.Request.Form["sSortDir_" + i]);
            }
        }

        #region Json actions

        [HttpGet]
        public ActionResult UserActivityJson()
        {
            var activityModel = new UserActivityViewModel();

            var responseObj = new
            {
                activityModel.ServiceAccountsCount,
                activityModel.TotalLecturersCount,
                activityModel.TotalStudentsCount,
                activityModel.TotalUsersCount,
                activityModel.UserActivityJson
            };

            return JsonResponse(responseObj);
        }

        [HttpGet]
        public ActionResult StudentsJson()
        {
            var students = this.StudentManagementService.GetStudents();

            var result = students.Select(s => new ModifyStudentViewModel(s) {Avatar = null});

            return JsonResponse(result);
        }

        [HttpGet]
        public ActionResult GetStudentJson(int id)
        {
            var student = this.StudentManagementService.GetStudent(id);

            if (student == null) return StatusCode(HttpStatusCode.BadRequest);
            var model = new ModifyStudentViewModel(student);

            return JsonResponse(model);
        }

        [HttpPost]
        public ActionResult SaveStudentJson(ModifyStudentViewModel model)
        {
            if (!this.ModelState.IsValid) return StatusCode(HttpStatusCode.BadRequest);
            try
            {
                var user = this.UsersManagementService.GetUser(model.Id);

                if (user != null)
                {
                    model.ModifyStudent();
                    return StatusCode(HttpStatusCode.OK);
                }
            }
            catch
            {
                return StatusCode(HttpStatusCode.InternalServerError);
            }

            return StatusCode(HttpStatusCode.BadRequest);
        }

        [HttpPost]
        public ActionResult AddProfessorJson(RegisterViewModel model)
        {
            if (!this.ModelState.IsValid) return StatusCode(HttpStatusCode.BadRequest);
            try
            {
                var user = this.UsersManagementService.GetUserByName(model.Name, model.Surname, model.Patronymic);

                if (user == null)
                {
                    model.RegistrationUser(new[] {"lector"});
                    return StatusCode(HttpStatusCode.OK);
                }
            }
            catch
            {
                return StatusCode(HttpStatusCode.InternalServerError);
            }

            return StatusCode(HttpStatusCode.BadRequest);
        }

        [HttpGet]
        public ActionResult GetProfessorJson(int id)
        {
            var lecturer = this.LecturerManagementService.GetLecturer(id);

            if (lecturer == null) return StatusCode(HttpStatusCode.BadRequest);
            var model = LecturerViewModel.FormLecturers(lecturer, null);
            return JsonResponse(model);
        }

        [HttpPost]
        public ActionResult SaveProfessorJson(ModifyLecturerViewModel model)
        {
            if (!this.ModelState.IsValid) return StatusCode(HttpStatusCode.BadRequest);
            try
            {
                model.ModifyLecturer();

                return StatusCode(HttpStatusCode.OK);
            }
            catch(Exception ex)
            {
                return StatusCode(HttpStatusCode.InternalServerError, ex.StackTrace);
            }
        }

        [HttpPost]
        public ActionResult AddGroupJson(GroupViewModel model)
        {
            if (!this.ModelState.IsValid) return StatusCode(HttpStatusCode.BadRequest, "Невалидная модель.");
            try
            {
                if (!model.CheckGroupName())
                {
                    return StatusCode(HttpStatusCode.BadRequest, "Группа с таким именем уже существует.");
                }

                model.AddGroup();
                return StatusCode(HttpStatusCode.OK);
            }
            catch (MembershipCreateUserException e)
            {
                return StatusCode(HttpStatusCode.InternalServerError, e.Message);
            }
        }

        [HttpGet]
        public ActionResult GetGroupJson(int id)
        {
            var group = this.GroupManagementService.GetGroup(id);

            if (group == null) return StatusCode(HttpStatusCode.BadRequest);
            var model = new GroupViewModel(group);
            return JsonResponse(model);
        }

        [HttpPost]
        public ActionResult SaveGroupJson(GroupViewModel model)
        {
            if (!this.ModelState.IsValid) return StatusCode(HttpStatusCode.BadRequest, "Невалидная модель.");
            try
            {
                model.ModifyGroup();
                return StatusCode(HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                return StatusCode(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        public ActionResult GetProfessorsJson()
        {
            var lecturers = this.LecturerManagementService.GetLecturers();

            var responseModel = lecturers.Select(l => LecturerViewModel.FormLecturers(l, null));

            return JsonResponse(responseModel);
        }

        [HttpGet]
        [AllowAnonymous]
        public ActionResult GetGroupsJson()
        {
            var groups = this.GroupManagementService.GetGroups();

            var responseModel = groups.Select(l => GroupViewModel.FormGroup(l, null));

            return JsonResponse(responseModel);
        }

        [HttpGet]
        public ActionResult GetSubjectsJson(int id)
        {
            var subjects = this.SubjectManagementService.GetSubjectsByStudent(id).OrderBy(subject => subject.Name)
                .ToList();
            var student = this.StudentManagementService.GetStudent(id);

            if (subjects.Count <= 0) return StatusCode(HttpStatusCode.BadRequest);
            var model = ListSubjectViewModel.FormSubjects(subjects, student.FullName);
            return JsonResponse(model);

        }

        [HttpGet]
        public ActionResult GetResetPasswordModelJson(int id)
        {
            try
            {
                var user = this.UsersManagementService.GetUser(id);

                var resetPassModel = new ResetPasswordViewModel(user);

                return JsonResponse(resetPassModel);
            }
            catch (Exception ex)
            {
                return StatusCode(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpPost]
        public ActionResult ResetPasswordJson(ResetPasswordViewModel model)
        {
            if (!this.ModelState.IsValid) return StatusCode(HttpStatusCode.BadRequest, "Invalid model.");
            var resetResult = model.ResetPassword();

            return !resetResult ? StatusCode(HttpStatusCode.Conflict, "Password hasn't been reseted.") : StatusCode(HttpStatusCode.OK);

        }

        [HttpDelete]
        public ActionResult DeleteUserJson(int id)
        {
            try
            {
                var deleted = this.UsersManagementService.DeleteUser(id);

                if (deleted) return StatusCode(HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                return StatusCode(HttpStatusCode.InternalServerError, ex.Message);
            }

            return StatusCode(HttpStatusCode.BadRequest);
        }

        [HttpGet]
        public ActionResult AttendanceJson(int id)
        {
            var user = this.UsersManagementService.GetUser(id);

            if (user?.Attendance == null) return StatusCode(HttpStatusCode.BadRequest);
            var data = user.AttendanceList.GroupBy(e => e.Date)
                .Select(d => new {day = d.Key.ToString("d"), count = d.Count()});

            return JsonResponse(new {resultMessage = user.FullName, attendance = data});
        }

        [HttpDelete]
        public ActionResult DeleteStudentJson(int id)
        {
            try
            {
                var student = this.StudentManagementService.GetStudent(id);

                if (student == null) return StatusCode(HttpStatusCode.BadRequest);
                var result = this.StudentManagementService.DeleteStudent(id);

                return StatusCode(result ? HttpStatusCode.OK : HttpStatusCode.Conflict);

            }
            catch (Exception ex)
            {
                return StatusCode(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpDelete]
        public ActionResult DeleteLecturerJson(int id)
        {
            try
            {
                var lecturer = this.LecturerManagementService.GetLecturer(id);

                if (lecturer == null) return StatusCode(HttpStatusCode.BadRequest);
                if (lecturer.SubjectLecturers != null && lecturer.SubjectLecturers.Any() &&
                    lecturer.SubjectLecturers.All(e => e.Subject.IsArchive))
                    foreach (var lecturerSubjectLecturer in lecturer.SubjectLecturers)
                        this.LecturerManagementService.DisjoinOwnerLector(lecturerSubjectLecturer.SubjectId, id);

                var result = this.LecturerManagementService.DeleteLecturer(id);

                return StatusCode(result ? HttpStatusCode.OK : HttpStatusCode.Conflict);

            }
            catch (Exception ex)
            {
                return StatusCode(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpDelete]
        public ActionResult DeleteGroupJson(int id)
        {
            try
            {
                var group = this.GroupManagementService.GetGroup(id);
                if (group == null) return StatusCode(HttpStatusCode.BadRequest);
                if (group.Students != null && group.Students.Count > 0) return StatusCode(HttpStatusCode.Conflict);

                this.GroupManagementService.DeleteGroup(id);
                return StatusCode(HttpStatusCode.OK);

            }
            catch (Exception ex)
            {
                return StatusCode(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        public ActionResult ListOfGroupsByLecturerJson(int id)
        {
            var sub = this.SubjectManagementService.GetSubjectsByLector(id).OrderBy(subject => subject.Name).ToList();
            var lec = this.LecturerManagementService.GetLecturer(id);
            if (lec == null) return StatusCode(HttpStatusCode.BadRequest);
            var model = ListSubjectViewModel.FormSubjects(sub, lec.FullName);
            var response = new
            {
                Lecturer = model.Name,
                Subjects = model.Subjects.Distinct().Select(s => new
                {
                    SubjectName = s.Name,
                    Groups = s.SubjectGroups.Where(sg => sg.Group != null).Select(sg => new
                    {
                        GroupName = sg.Group.Name,
                        StudentsCount = sg.Group.Students.Count
                    })
                })
            };
            return JsonResponse(response);

        }

        [HttpGet]
        public ActionResult ListOfSubjectsByStudentJson(int id)
        {
            var groups = this.SubjectManagementService.GetSubjectsByStudent(id).OrderBy(subject => subject.Name)
                .ToList();
            var stud = this.StudentManagementService.GetStudent(id);

            if (stud == null) return StatusCode(HttpStatusCode.BadRequest);
            var model = ListSubjectViewModel.FormSubjects(groups, stud.FullName);
            var response = new
            {
                Student = model.Name,
                Subjects = model.Subjects.Select(s => new
                {
                    SubjectName = s.Name,
                    Lecturers = s.SubjectLecturers?.Select(prof => prof.Lecturer.FullName)
                })
            };
            return JsonResponse(response);

        }

        [HttpGet]
        public ActionResult ListOfStudentsByGroupJson(int id)
        {
            try
            {
                var students = this.StudentManagementService.GetGroupStudents(id)
                    .OrderBy(student => student.FullName)
                    .ToList();

                var response = new
                {
                    Group = students.Count > 0 ? students[0].Group.Name : null,
                    Students = students.Select(s => new
                    {
                        Name = s.FullName,
                        IsConfirmed = s.Confirmed ?? false
                    })
                };
                return JsonResponse(response);
            }
            catch (Exception ex)
            {
                return StatusCode(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpPost]
        public ActionResult EditStudentJson(ModifyStudentViewModel model)
        {
            if (!this.ModelState.IsValid) return StatusCode(HttpStatusCode.BadRequest);
            try
            {
                model.ModifyStudent();
                return StatusCode(HttpStatusCode.Created, "Студент сохранен");
            }
            catch (Exception ex)
            {
                return StatusCode(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        #endregion

        #region Dependencies

        public IStudentManagementService StudentManagementService =>
            this.ApplicationService<IStudentManagementService>();

        public ISubjectManagementService SubjectManagementService =>
            this.ApplicationService<ISubjectManagementService>();

        public IGroupManagementService GroupManagementService => this.ApplicationService<IGroupManagementService>();

        public ILecturerManagementService LecturerManagementService =>
            this.ApplicationService<ILecturerManagementService>();

        public IUsersManagementService UsersManagementService => this.ApplicationService<IUsersManagementService>();

        public IDpManagementService DpManagementService => this.ApplicationService<IDpManagementService>();

        #endregion
    }
}