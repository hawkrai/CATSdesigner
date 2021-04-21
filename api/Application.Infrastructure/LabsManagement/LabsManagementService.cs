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
                    new Query<UserLabFiles>(e => e.UserId == userId && e.SubjectId == subjectId && !e.IsCoursProject)
                    .Include(x => x.Lab)).ToList();
            }
        }

        public bool HasSubjectProtection(int userId, int subjectId)
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                 return false;
            }
        }

        public bool HasLabProtection(int userId, int labId)
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                return true;
            }
        }
    }
}
