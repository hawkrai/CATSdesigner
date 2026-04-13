using Application.Core;
using Application.Infrastructure.DTO;
using LMPlatform.Data.Infrastructure;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace Application.Infrastructure.DPManagement
{
    public class UserService : IUserService
    {
        public UserData GetUserInfo(int userId)
        {
            var now = DateTime.Now;
            var user = Context.Users
                .Include(x => x.Student)
                .Include(x => x.Lecturer)
                .SingleOrDefault(x => x.Id == userId);

            if (user == null)
                return null;

            var studentGroup = user.Student != null
                ? Context.Groups.SingleOrDefault(g => g.Id == user.Student.GroupId)
                : null;

            var selectedGroupIds = user.Lecturer != null && user.Lecturer.IsSecretary
                ? Context.Groups
        .Where(g => g.SecretaryId == user.Lecturer.Id)
        .Select(g => g.Id)
        .ToList()
    : new List<int>();

            return new UserData
            {
                UserId = user.Id,
                IsLecturer = user.Lecturer != null,
                IsStudent = user.Student != null,
                IsSecretary = user.Lecturer != null && user.Lecturer.IsSecretary,
                HasChosenDiplomProject = user.Student != null
                    && Context.AssignedDiplomProjects.Any(x => x.StudentId == user.Student.Id && !x.ApproveDate.HasValue),
                HasAssignedDiplomProject = user.Student != null
                    && Context.AssignedDiplomProjects.Any(x => x.StudentId == user.Student.Id && x.ApproveDate.HasValue),
                IsLecturerHasGraduateStudents = user.Lecturer != null && user.Lecturer.IsLecturerHasGraduateStudents,
                IsGraduate = studentGroup != null
                    && int.TryParse(studentGroup.GraduationYear, out int gradYear)
                    && gradYear == now.Year,
                SelectedGroupIds = selectedGroupIds
            };
        }

        private readonly LazyDependency<IDpContext> context = new LazyDependency<IDpContext>();

        private IDpContext Context
        {
            get { return context.Value; }
        }
    }
}