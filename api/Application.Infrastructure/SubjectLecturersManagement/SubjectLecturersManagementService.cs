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
			var subjectLecturers = repositoriesContainer.RepositoryFor<SubjectLecturer>()
				.GetAll(new Query<SubjectLecturer>(e => e.LecturerId == lecturerId)
					.Include(e => e.Subject.SubjectGroups.Select(x => x.SubjectStudents)))
				.ToList();

			return subjectLecturers.Any(x => x.Subject.SubjectGroups.Any(x => x.SubjectStudents.Any(x => x.StudentId == studentId)));
		}
    }
}
