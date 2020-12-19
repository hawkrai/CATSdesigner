using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Web.Mvc;
using Application.Core.Extensions;
using Application.Core.Helpers;
using Application.Core.UI.Controllers;
using Application.Infrastructure.BugManagement;
using Application.Infrastructure.LecturerManagement;
using Application.Infrastructure.ProjectManagement;
using Application.Infrastructure.StudentManagement;
using Application.Infrastructure.UserManagement;
using LMPlatform.Models;
using LMPlatform.UI.Attributes;
using LMPlatform.UI.ViewModels.BTSViewModels;
using WebMatrix.WebData;

namespace LMPlatform.UI.Controllers
{
    [JwtAuth(Roles = "student, lector")]
    public class BTSController : BasicController
    {
        private static int _currentProjectId;
        private static int _currentBugId;
        private static int _prevBugStatus;

        public IProjectManagementService ProjectManagementService =>
            this.ApplicationService<IProjectManagementService>();

        public IBugManagementService BugManagementService => this.ApplicationService<IBugManagementService>();

        [HttpGet]
        public ActionResult AssignStudentOnProject(int id)
        {
            var projectUserViewModel = new AssignUserViewModel(0, id);
            var response = projectUserViewModel.AsExpandoObject();
            response.Groups = projectUserViewModel.GetGroups();
            response.Students = projectUserViewModel.GetStudents(projectUserViewModel.GroupId);
            response.Roles = projectUserViewModel.GetRoles();
            return JsonResponse(response);
        }

        [HttpGet]
        public ActionResult AssignLecturerOnProject(int id)
        {
            var projectUserViewModel = new AssignUserViewModel(0, id);
            var response = projectUserViewModel.AsExpandoObject();
            response.Lecturers = projectUserViewModel.GetLecturers();
            response.Roles = projectUserViewModel.GetRoles();
            return JsonResponse(response);
        }

        [HttpDelete]
        public JsonResult DeleteProjectUser(int id)
        {
            this.ProjectManagementService.DeleteProjectUser(id);
            return this.Json(id);
        }

        [HttpPost]
        public ActionResult SaveProjectUser(AssignUserViewModel model)
        {
            model.SaveAssignment();

            return StatusCode(HttpStatusCode.OK);
        }

        public ActionResult EditProject(int id)
        {
            var projectViewModel = new AddOrEditProjectViewModel(id);
            return JsonResponse(projectViewModel);
        }

        [HttpDelete]
        public JsonResult DeleteProject(int id)
        {
            this.ProjectManagementService.DeleteProject(id);
            return this.Json(id);
        }

        [HttpGet]
        public ActionResult ClearProject(int id)
        {
            this.ProjectManagementService.ClearProject(id);
            return StatusCode(HttpStatusCode.OK);
        }

        [HttpPost]
        public ActionResult SaveProject(AddOrEditProjectViewModel model)
        {
            model.Save(UserContext.CurrentUserId);
            return StatusCode(HttpStatusCode.OK);
        }

        [HttpPost]
        public ActionResult ProjectManagement(int id, string comment)
        {
            var model = new ProjectsViewModel(id);
            model.SaveComment(comment);
            var comments = model.GetProjectComments()
                .Select(c => new
                {
                    c.User.FullName,
                    c.CommentText,
                    c.CommentingDate
                }).ToArray();

            return JsonResponse(comments);
        }

        [HttpGet]
        public ActionResult BugManagement(int id)
        {
            _currentProjectId = id;
            var model = new BugListViewModel(id);
            return JsonResponse(model);
        }

        [HttpDelete]
        public JsonResult DeleteBug(int id)
        {
            this.BugManagementService.DeleteBug(id);
            return this.Json(id);
        }

        [HttpPost]
        public ActionResult SaveBug(AddOrEditBugViewModel model)
        {
            model.Save(UserContext.CurrentUserId, _currentProjectId);
            var bugLog = new BugLog
            {
                BugId = model.BugId,
                UserId = UserContext.CurrentUserId,
                UserName = this.ProjectManagementService.GetCreatorName(UserContext.CurrentUserId),
                PrevStatusId = _prevBugStatus,
                CurrStatusId = model.StatusId,
                LogDate = DateTime.Now
            };
            if (model.BugId != 0) model.SaveBugLog(bugLog);

            return StatusCode(HttpStatusCode.OK);
        }

        [HttpGet]
        public JsonResult GetStudents(int groupId)
        {
            var groupOfStudents = new StudentManagementService().GetGroupStudents(groupId);
            var studentList = groupOfStudents
                .Where(e => e.Confirmed == null || e.Confirmed.Value)
                .Where(student =>
                    this.ProjectManagementService.IsUserAssignedOnProject(student.Id, _currentProjectId) == false)
                .ToList();

            var students = studentList.Select(v => new SelectListItem
            {
                Text = v.FullName,
                Value = v.Id.ToString(CultureInfo.InvariantCulture)
            }).ToList();

            return this.Json(new SelectList(students, "Value", "Text"));
        }

        [HttpGet]
        public JsonResult GetDeveloperNames()
        {
            var _context = new UsersManagementService();
            var context = new ProjectManagementService();
            var projectUsers = context.GetProjectUsers(_currentProjectId).ToList().Where(e => e.ProjectRoleId == 1);

            var users = new List<User>();

            var currProjectUser =
                context.GetProjectUsers(_currentProjectId).Single(e => e.UserId == UserContext.CurrentUserId);
            if (currProjectUser.ProjectRoleId == 1)
                users.Add(_context.GetUser(currProjectUser.UserId));
            else
                users.AddRange(projectUsers.Select(user => _context.GetUser(user.UserId)));

            var userList = users.Select(e => new SelectListItem
            {
                Text = context.GetCreatorName(e.Id),
                Value = e.Id.ToString(CultureInfo.InvariantCulture)
            }).ToList();

            return this.Json(new SelectList(userList, "Value", "Text"));
        }

        [HttpGet]
        public bool IsUserAnAssignedDeveloper()
        {
            var bug = new BugManagementService().GetBug(_currentBugId);
            var context = new ProjectManagementService();
            var projectRoleId = context.GetProjectUsers(bug.ProjectId)
                .Single(e => e.UserId == UserContext.CurrentUserId).ProjectRoleId;
            return bug.AssignedDeveloperId == 0 && projectRoleId == 1 ||
                   bug.AssignedDeveloperId == UserContext.CurrentUserId || projectRoleId != 1;
        }

        [HttpGet]
        public JsonResult GetLecturers()
        {
            var _lecturers = new LecturerManagementService().GetLecturers();

            var lecturerList = _lecturers.Where(lecturer =>
                    this.ProjectManagementService.IsUserAssignedOnProject(lecturer.Id, _currentProjectId) == false)
                .ToList();

            var lecturers = lecturerList.Select(v => new SelectListItem
            {
                Text = v.FullName,
                Value = v.Id.ToString(CultureInfo.InvariantCulture)
            }).ToList();

            return this.Json(new SelectList(lecturers, "Value", "Text"));
        }

        [HttpGet]
        public ActionResult GetUserInformation(int id)
        {
            var model = new UserInfoViewModel(id);
            return JsonResponse(model);
        }

        [HttpGet]
        public ActionResult BugDetails(int id)
        {
            var model = new BugsViewModel(id);
            _currentBugId = id;
            return JsonResponse(model);
        }
    }
}