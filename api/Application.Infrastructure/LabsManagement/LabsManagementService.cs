using Application.Core.Data;
using LMPlatform.Data.Repositories;
using LMPlatform.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Infrastructure.LabsManagement
{
    public class LabsManagementService : ILabsManagementService
    {
        public IEnumerable<UserLabFiles> GetUserLabFiles(int userId, int subjectId)
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                return repositoriesContainer.RepositoryFor<UserLabFiles>().GetAll(
                    new Query<UserLabFiles>(e => e.UserId == userId && e.SubjectId == subjectId && !e.IsCoursProject && (e.LabId.Value > 0 || e.PracticalId.Value <= 0 && e.LabId.Value <= 0))
                    .Include(x => x.Lab)).ToList();
            }
        }

        public bool HasSubjectProtection(int groupId, int subjectId)
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                return repositoriesContainer.RepositoryFor<UserLabFiles>().GetAll(new Query<UserLabFiles>(x =>
                x.User.Student.GroupId == groupId &&
                x.SubjectId == subjectId && !x.IsCoursProject && !x.IsReceived && !x.IsReturned && x.LabId.Value > 0)).Any();
            }
        }

        public List<UserLabFiles> GetGroupLabFiles(int subjectId, int groupId)
        {
            using var repositoriesContainer = new LmPlatformRepositoriesContainer();
            return repositoriesContainer.RepositoryFor<UserLabFiles>()
                .GetAll(new Query<UserLabFiles>(e => e.SubjectId == subjectId && e.User.Student.GroupId == groupId && !e.IsCoursProject && e.LabId.Value > 0))
                .ToList();

        }

        public List<UserLabFiles> GetStudentLabFiles(int subjectId, int studentId)
        {
            using var repositoriesContainer = new LmPlatformRepositoriesContainer();
            return repositoriesContainer.RepositoryFor<UserLabFiles>()
                .GetAll(new Query<UserLabFiles>(e => e.SubjectId == subjectId && e.User.Student.Id == studentId && !e.IsCoursProject && e.LabId.Value > 0))
                .ToList();
        }
    }
}
