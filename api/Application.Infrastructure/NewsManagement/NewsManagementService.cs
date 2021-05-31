using Application.Core.Data;
using LMPlatform.Data.Repositories;
using LMPlatform.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Infrastructure.NewsManagement
{
    public class NewsManagementService : INewsManagementService
    {
        public IEnumerable<SubjectNews> GetNewsByGroupName(string groupName)
        {
            using var repositoriesContainer = new LmPlatformRepositoriesContainer();
            return repositoriesContainer.NewsRepository.GetAll(new Query<SubjectNews>(x => x.Subject.SubjectGroups.Any(x => x.Group.Name == groupName))).ToList();
        }

        public IEnumerable<SubjectNews> GetUserNewsByFIO(string fio)
        {
            using var repositoriesContainer = new LmPlatformRepositoriesContainer();
            return repositoriesContainer.NewsRepository.GetAll(new Query<SubjectNews>(x => x.Subject.SubjectGroups.Any(x => 
            x.SubjectStudents.Any(s => s.Student.LastName + " " + s.Student.FirstName + " " + s.Student.MiddleName == fio))))
              .ToList();
        }
    }
}
