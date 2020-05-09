using System.Collections.Generic;
using System.Linq;
using Application.Infrastructure.SubjectManagement;
using LMPlatform.Data.Infrastructure;
using LMPlatform.Models;

namespace LMPlatform.UI.ViewModels.BTSViewModels
{
    public class UserInfoViewModel
    {
        public UserInfoViewModel(int _id)
        {
            var context = new LmPlatformModelsContext();
            var id = context.ProjectUsers.Find(_id).UserId;

            if (context.Students.Find(id) != null)
            {
                //var creator = context.Students.Find(id);
                var creator = new Student();
                foreach (var student in context.Students)
                {
                    if (student.Id == id)
                    {
                        creator = student;
                    }
                }

                this.UserName = creator.LastName + " " + creator.FirstName + " " + creator.MiddleName;
                this.GroupNumber = context.Groups.Find(creator.GroupId).Name;
                this.ProjectQuentity = context.ProjectUsers.Select(e => e.User).Count(e => e.Id == creator.Id);
                this.Role = "Студент";
            }
            else
            {
                var creator = context.Lecturers.Find(id);
                this.UserName = creator.LastName + " " + creator.FirstName + " " + creator.MiddleName;
                this.ProjectQuentity = context.ProjectUsers.Select(e => e.User).Count(e => e.Id == creator.Id);
                this.Role = "Преподаватель";

                var _context = new SubjectManagementService();
                this.SubjectList = new List<Subject>();
                foreach (var subject in _context.GetUserSubjects(creator.Id)) this.SubjectList.Add(subject);
            }
        }

        public string UserName { get; set; }

        public string Role { get; set; }

        public string GroupNumber { get; set; }

        public List<Subject> SubjectList { get; set; }

        public int ProjectQuentity { get; set; }
    }
}