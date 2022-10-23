using System;
using System.IO;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Web.Helpers;
using Application.Core.Data;
using Application.Core.Helpers;
using LMPlatform.Data.Infrastructure;
using LMPlatform.Models.DP;
using WebMatrix.WebData;

namespace Application.Infrastructure.UserManagement
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Security;

    using Application.Core;
    using Application.Core.Constants;
    using Application.Core.Extensions;
    using Application.Infrastructure.AccountManagement;
    using Application.Infrastructure.ProjectManagement;

    using LMPlatform.Data.Repositories;
    using LMPlatform.Data.Repositories.RepositoryContracts;
    using LMPlatform.Models;
    using CPManagement;
    using System.Data.Entity;
    using System.Threading.Tasks;

    public class UsersManagementService : IUsersManagementService
    {
        private readonly LazyDependency<IMembershipRepository> _membershipRepository = new LazyDependency<IMembershipRepository>();
        private readonly LazyDependency<IAccountManagementService> _accountManagementService = new LazyDependency<IAccountManagementService>();
        private readonly LazyDependency<IProjectManagementService> _projectManagementService = new LazyDependency<IProjectManagementService>();

        private readonly LazyDependency<ICPManagementService> _cpManagementService = new LazyDependency<ICPManagementService>();

        private ICPManagementService CPManagementService
        {
            get { return _cpManagementService.Value; }
        }

        public IMembershipRepository MembershipRepository
        {
            get
            {
                return _membershipRepository.Value;
            }
        }

        public IAccountManagementService AccountManagementService
        {
            get
            {
                return _accountManagementService.Value;
            }
        }

        public IProjectManagementService ProjectManagementService
        {
            get
            {
                return _projectManagementService.Value;
            }
        }

        private readonly LazyDependency<IDpContext> context = new LazyDependency<IDpContext>();

        private IDpContext Context
        {
            get { return context.Value; }
        }

        public User GetUser(string userName)
        {
            try
            {
                if (IsExistsUser(userName))
                {
                    using var repositoriesContainer = new LmPlatformRepositoriesContainer();
                    return repositoriesContainer.UsersRepository.GetBy(new Query<User>(e => e.UserName == userName)
                        .Include(u => u.Student)
                        .Include(e => e.Student.Group)
                        .Include(u => u.Lecturer)
                        .Include(u => u.Membership.Roles));
                }
            }
            catch (ReflectionTypeLoadException ex)
            {
                StringBuilder sb = new StringBuilder();
                foreach (Exception exSub in ex.LoaderExceptions)
                {
                    sb.AppendLine(exSub.Message);
                    FileNotFoundException exFileNotFound = exSub as FileNotFoundException;
                    if (exFileNotFound != null)
                    {
                        if (!string.IsNullOrEmpty(exFileNotFound.FusionLog))
                        {
                            sb.AppendLine("Fusion Log:");
                            sb.AppendLine(exFileNotFound.FusionLog);
                        }
                    }
                    sb.AppendLine();
                }
                string errorMessage = sb.ToString();
                throw new Exception(errorMessage);
            }


            return null;
        }

        public async Task<User> GetUserAsync(string userName)
        {
            try
            {
                if (await IsExistsUserAsync(userName))
                {
                    using var repositoriesContainer = new LmPlatformRepositoriesContainer();
                    return await repositoriesContainer.UsersRepository.GetByAsync(new Query<User>(e => e.UserName == userName)
                        .Include(u => u.Student)
                        .Include(e => e.Student.Group)
                        .Include(u => u.Lecturer)
                        .Include(u => u.Membership.Roles));
                }
            }
            catch (ReflectionTypeLoadException ex)
            {
                StringBuilder sb = new StringBuilder();
                foreach (Exception exSub in ex.LoaderExceptions)
                {
                    sb.AppendLine(exSub.Message);
                    FileNotFoundException exFileNotFound = exSub as FileNotFoundException;
                    if (exFileNotFound != null)
                    {
                        if (!string.IsNullOrEmpty(exFileNotFound.FusionLog))
                        {
                            sb.AppendLine("Fusion Log:");
                            sb.AppendLine(exFileNotFound.FusionLog);
                        }
                    }
                    sb.AppendLine();
                }
                string errorMessage = sb.ToString();
                throw new Exception(errorMessage);
            }

            return null;
        }

        public User GetUserById(int id)
        {
            try
            {
                using var repositoriesContainer = new LmPlatformRepositoriesContainer();

                return repositoriesContainer.UsersRepository.GetBy(new Query<User>(u => u.Id == id)
                .Include(u => u.Student).Include(e => e.Student.Group).Include(u => u.Lecturer).Include(u => u.Membership.Roles));
            }
            catch (ReflectionTypeLoadException ex)
            {
                StringBuilder sb = new StringBuilder();
                foreach (Exception exSub in ex.LoaderExceptions)
                {
                    sb.AppendLine(exSub.Message);
                    FileNotFoundException exFileNotFound = exSub as FileNotFoundException;
                    if (exFileNotFound != null)
                    {
                        if (!string.IsNullOrEmpty(exFileNotFound.FusionLog))
                        {
                            sb.AppendLine("Fusion Log:");
                            sb.AppendLine(exFileNotFound.FusionLog);
                        }
                    }
                    sb.AppendLine();
                }
                string errorMessage = sb.ToString();
                throw new Exception(errorMessage);
            }


        }

            public User GetUserByName(string firstName, string lastName, string middleName)
            {
                using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
                {
                    var checkPatronymic = !string.IsNullOrEmpty(middleName);

                    var lecturers = repositoriesContainer.LecturerRepository.GetAll(
                            new Query<Lecturer>(e =>
                                (e.FirstName == firstName && e.LastName == lastName && !checkPatronymic)
                                || (checkPatronymic && (e.MiddleName == middleName && e.FirstName == firstName && e.LastName == lastName))))
                                .Select(l => l.User).ToList();

                    if (lecturers.Any())
                    {
                        return lecturers.First();
                    }

                    var students = repositoriesContainer.StudentsRepository.GetAll(
                            new Query<Student>(e =>
                                (e.FirstName == firstName && e.LastName == lastName && !checkPatronymic)
                                || (checkPatronymic && (e.MiddleName == middleName && e.FirstName == firstName && e.LastName == lastName))))
                                .Select(l => l.User);

                    return students.Any() ? students.First() : null;
                }
            }

            public User GetUser(int id)
            {
                using var repositoriesContainer = new LmPlatformRepositoriesContainer();

                return repositoriesContainer.UsersRepository.GetBy(new Query<User>(u => u.Id == id)
                    .Include(u => u.Student).Include(u => u.Lecturer).Include(u => u.Membership.Roles).Include(x => x.Attendances));
            }

            public void UpdateUser(User user)
            {
                using var repositoriesContainer = new LmPlatformRepositoriesContainer();

                repositoriesContainer.UsersRepository.Save(user);
            }

            public bool IsExistsUser(string userName)
            {
                using var repositoriesContainer = new LmPlatformRepositoriesContainer();
                if (repositoriesContainer.UsersRepository.GetBy(new Query<User>(e => e.UserName == userName)) != null)
                {
                    return true;
                }

                return false;
            }

            public async Task<bool> IsExistsUserAsync(string userName)
            {
                using var repositoriesContainer = new LmPlatformRepositoriesContainer();
                return await repositoriesContainer.UsersRepository.GetByAsync(new Query<User>(e => e.UserName == userName)) is not null;
            }

        public User CurrentUser
        {
            get
            {
                var userName = UserContext.CurrentUserName;

                return GetUser(userName);
            }
        }

        public bool DeleteUser(int id)
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                var query = new Query<User>().AddFilterClause(u => u.Id == id).Include(u => u.ProjectUsers).Include(u => u.Student);
                var user = repositoriesContainer.UsersRepository.GetBy(query);

                repositoriesContainer.MessageRepository.DeleteUserMessages(user.Id);

                var projects = user.ProjectUsers.DistinctBy(e => e.ProjectId).Select(e => e.ProjectId);
                foreach (var projectId in projects)
                {
                    ProjectManagementService.DeleteUserFromProject(id, projectId);
                }

                if (user.Student != null)
                {
                    var acp = user.Student.AssignedCourseProjects.Select(e => e.CourseProjectId);
                    foreach (var acpId in acp)
                    {
                        CPManagementService.DeleteUserFromAcpProject(id, acpId);
                    }

                    var subjects = repositoriesContainer.RepositoryFor<SubjectStudent>()
                        .GetAll(new Query<SubjectStudent>(e => e.StudentId == id));

                    foreach (var subjectS in subjects)
                    {
                        repositoriesContainer.RepositoryFor<SubjectStudent>().Delete(subjectS);
                    }

                    var diploms = Context.AssignedDiplomProjects.Where(e => e.StudentId == id).ToList();

                    var diplomsRessList = Context.DiplomPercentagesResults.Where(e => e.StudentId == id).ToList();

                    foreach (var diplom in diploms)
                    {
                        Context.AssignedDiplomProjects.Remove(diplom);
                        Context.SaveChanges();
                    }

                    foreach (var diplomsRes in diplomsRessList)
                    {
                        Context.DiplomPercentagesResults.Remove(diplomsRes);
                        Context.SaveChanges();
                    }
                }

                CPManagementService.DeletePercenageAndVisitStatsForUser(id);

                repositoriesContainer.ApplyChanges();
                var result = AccountManagementService.DeleteAccount(user.UserName);
                repositoriesContainer.ApplyChanges();

                return result;
            }
        }

        public User GetAdmin()
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                var admin = Roles.GetUsersInRole(Constants.Roles.Admin);
                if (admin.Length <= 0)
                {
                    return null;
                }

                var adminName = admin[0];
                var user = repositoriesContainer.UsersRepository.GetBy(new Query<User>().AddFilterClause(u => u.UserName == adminName));
                return user;
            }
        }

        public IEnumerable<User> GetUsers(bool includeRole = false)
        {
            var query = new Query<User>();
            if (includeRole)
            {
                query.Include(u => u.Membership.Roles);
            }
            using var repositoriesContainer = new LmPlatformRepositoriesContainer();

            return repositoriesContainer.UsersRepository.GetAll(query).ToList();
        }

        public void UpdateLastLoginDate(string userName)
        {
            using var repositoriesContainer = new LmPlatformRepositoriesContainer();
            var user = repositoriesContainer.UsersRepository.GetBy(new Query<User>(e => e.UserName == userName).Include(e => e.Attendances));
            if (user != null)
            {
                var now = DateTime.Now;
                user.LastLogin = now;
                user.Attendances.Add(new Attendance{ Login = now }); 
                repositoriesContainer.UsersRepository.Save(user, u => u.LastLogin == now);
            }
        }

        public (User, Role) Login(string userName, string password)
        {
            using var repositoriesContainer = new LmPlatformRepositoriesContainer();
             
            var user = repositoriesContainer.UsersRepository.GetBy(new Query<User>(e => e.UserName == userName)
                .Include(e => e.Student)
                .Include(u => u.Membership.Roles));
            if (user is null || !Crypto.VerifyHashedPassword(user.Membership.Password, password)) return default;
            var role = user.Membership.Roles.Single();
            return (user, role);
        }
    }
}
