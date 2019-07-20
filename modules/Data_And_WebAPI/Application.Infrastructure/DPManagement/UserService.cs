using Application.Core;
using Application.Infrastructure.DTO;
using LMP.Data.Infrastructure;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Application.Infrastructure.DPManagement
{
    public class UserService : IUserService
    {
        public UserData GetUserInfo(int userId)
        {
            var user = Context.Users.Include(x => x.Student).Include(x => x.Lecturer).Single(x => x.Id == userId);

            return new UserData
            {
                UserId = user.Id,
                IsLecturer = user.Lecturer != null,
                IsStudent = user.Student != null,
                IsSecretary = user.Lecturer != null && user.Lecturer.IsSecretary,
                HasChosenDiplomProject = user.Student != null 
                    && Context.AssignedDiplomProjects.Any(x => x.StudentId == user.Student.Id && !x.ApproveDate.HasValue),
                HasAssignedDiplomProject = user.Student != null 
                    && Context.AssignedDiplomProjects.Any(x => x.StudentId == user.Student.Id && x.ApproveDate.HasValue)
            };
        }

        private readonly LazyDependency<IDpContext> context = new LazyDependency<IDpContext>();

        private IDpContext Context
        {
            get { return context.Value; }
        }
    }
}