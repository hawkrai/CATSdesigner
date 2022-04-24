using Application.Core.Data;
using LMPlatform.Data.Repositories;
using LMPlatform.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Infrastructure.SubjectLecturersManagement
{
    public class SubjectLecturersManagementService : ISubjectLecturersManagementService
    {
        public bool HasStudent(int lecturerId, int studentId)
        {
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			var subjects = repositoriesContainer.SubjectRepository
				.GetAll(new Query<Subject>(e => !e.IsArchive && e.SubjectLecturers.Any(x => x.LecturerId == lecturerId))
					.Include(e => e.SubjectGroups.Select(x => x.Group.Students)))
				.ToList();

			return subjects.Any(x => x.SubjectGroups.Any(x => x.Group.Students.Any(x => x.Id == studentId)));
		}
    }
}
