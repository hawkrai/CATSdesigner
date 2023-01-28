using Application.Core;
using Application.Core.Data;
using Application.Infrastructure.FilesManagement;
using Application.Infrastructure.GroupManagement;
using Application.Infrastructure.SubjectManagement;
using LMPlatform.Models;
using LMPlatform.UI.Services.Modules.CoreModels;
using LMPlatform.UI.Services.Modules.Labs;
using System.Collections.Generic;
using System.Linq;

namespace LMPlatform.UI.Services.Courses
{
	// NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "CoursesService" in code, svc and config file together.
	// NOTE: In order to launch WCF Test Client for testing this service, please select CoursesService.svc or CoursesService.svc.cs at the Solution Explorer and start debugging.
	public class CoursesService : ICoursesService
	{
		private readonly LazyDependency<ISubjectManagementService> subjectManagementService = new LazyDependency<ISubjectManagementService>();

		public ISubjectManagementService SubjectManagementService => subjectManagementService.Value;

		private readonly LazyDependency<IFilesManagementService> filesManagementService = new LazyDependency<IFilesManagementService>();

		public IFilesManagementService FilesManagementService => filesManagementService.Value;

		private readonly LazyDependency<IGroupManagementService> groupManagementService = new LazyDependency<IGroupManagementService>();

		public IGroupManagementService GroupManagementService => groupManagementService.Value;

		public UserLabFilesResult GetFiles(int userId, int subjectId)
		{
			try
			{

				var model = new List<UserLabFileViewData>();
				var data = SubjectManagementService.GetUserCourseFiles(userId, subjectId);
				model = data.Select(e => new UserLabFileViewData
				{
					Comments = e.Comments,
					Id = e.Id,
					PathFile = e.Attachments,
					IsReceived = e.IsReceived,
					IsReturned = e.IsReturned,
					IsCoursProject = e.IsCoursProject,
					UserId = e.UserId,
					Date = e.Date != null ? e.Date.Value.ToString("dd.MM.yyyy HH:mm") : string.Empty,
					Attachments = FilesManagementService.GetAttachments(e.Attachments).ToList(),
				}).ToList();
				return new UserLabFilesResult
				{
					UserLabFiles = model,
					Message = "Данные получены",
					Code = "200"
				};
			}
			catch
			{
				return new UserLabFilesResult
				{
					Message = "Произошла ошибка при получении данных",
					Code = "500"
				};
			}
		}
		public StudentsMarksResult GetFilesV2(int subjectId, int groupId, int isCp)
		{
			try
			{
				var group = GroupManagementService.GetGroups(new Query<Group>(e => e.SubjectGroups.Any(x => x.SubjectId == subjectId && x.GroupId == groupId))
					.Include(e => e.Students.Select(x => x.User))).FirstOrDefault();
				IList<SubGroup> subGroups = this.SubjectManagementService.GetSubGroupsV2(subjectId, group.Id);
				var students = new List<StudentMark>();

				foreach (var student in group.Students.Where(e => e.Confirmed == null || e.Confirmed.Value).OrderBy(e => e.LastName))
				{
					var files =
						SubjectManagementService.GetUserCourseFiles(student.Id, subjectId).Select(
							t =>
							new UserLabFileViewData
							{
								Comments = t.Comments,
								Date = t.Date != null ? t.Date.Value.ToString("dd.MM.yyyy HH:mm") : string.Empty,
								Id = t.Id,
								PathFile = t.Attachments,
								IsReceived = t.IsReceived,
								IsReturned = t.IsReturned,
								IsCoursProject = t.IsCoursProject,
								UserId = t.UserId,
								Attachments = FilesManagementService.GetAttachments(t.Attachments).ToList()
							}).ToList();
					students.Add(new StudentMark
					{
						StudentId = student.Id,
						FullName = student.FullName,
						SubGroup = subGroups.FirstOrDefault(x => x.Name == "first").SubjectStudents.Any(x => x.StudentId == student.Id) ? 1 : subGroups.FirstOrDefault(x => x.Name == "second").SubjectStudents.Any(x => x.StudentId == student.Id) ? 2 : subGroups.FirstOrDefault(x => x.Name == "third").SubjectStudents.Any(x => x.StudentId == student.Id) ? 3 : 4,
						FileLabs = files
					});
				}

				return new StudentsMarksResult
				{
					Students = students,
					Message = "",
					Code = "200"
				};
			}
			catch
			{
				return new StudentsMarksResult
				{
					Message = "Произошла ошибка при получении результатов студентов",
					Code = "500"
				};
			}
		}
	}
}
