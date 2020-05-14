using System.Collections.Generic;
using System.Net;
using System.Web.Mvc;
using Application.Core.UI.Controllers;
using Application.Infrastructure.GroupManagement;
using Application.Infrastructure.SubjectManagement;
using LMPlatform.Models;
using LMPlatform.UI.ViewModels.ParentalViewModels;

namespace LMPlatform.UI.Controllers
{
    public class ParentalController : BasicController
    {
        public IGroupManagementService GroupManagementService => this.ApplicationService<IGroupManagementService>();

        public ISubjectManagementService SubjectManagementService =>
            this.ApplicationService<ISubjectManagementService>();

        public ActionResult Index(string id)
        {
            var group = this.GroupManagementService.GetGroupByName(id);

            if (group == null) return StatusCode(HttpStatusCode.BadRequest);
            var model = new ParentalViewModel
            {
                Group = group
            };

            return JsonResponse(model);
        }

        public ActionResult GetSideNav(int groupId)
        {
            var group = this.GroupManagementService.GetGroup(groupId);
            var subjects = this.SubjectManagementService.GetGroupSubjects(groupId);

            var model = new ParentalViewModel(group)
            {
                Subjects = subjects
            };
            return JsonResponse(model);
        }

        public List<Subject> GetSubjects(int groupId)
        {
            return this.SubjectManagementService.GetGroupSubjects(groupId);
        }

        public bool IsValidGroup(string groupName)
        {
            return this.GroupManagementService.GetGroupByName(groupName) != null;
        }
    }
}