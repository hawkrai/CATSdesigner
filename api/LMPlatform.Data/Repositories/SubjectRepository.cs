using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Linq;
using Application.Core.Data;
using Application.Core.Extensions;
using LMPlatform.Data.Infrastructure;
using LMPlatform.Data.Repositories.RepositoryContracts;
using LMPlatform.Models;

namespace LMPlatform.Data.Repositories
{
	public class SubjectRepository : RepositoryBase<LmPlatformModelsContext, Subject>, ISubjectRepository
	{
		public SubjectRepository(LmPlatformModelsContext dataContext)
			: base(dataContext)
		{
		}

		public List<Subject> GetSubjectsInfoByLecturerId(int lecturerId)
		{
			using (var context = new LmPlatformModelsContext())
			{
				
                {
					var subjectLecturer = context.Set<SubjectLecturer>().
						Where(sg => sg.LecturerId == lecturerId);
					return subjectLecturer.Select(sg => sg.Subject).Include(s => s.SubjectGroups).DistinctBy(x => x.Id).ToList();
				}
			}
		}

		public List<Subject> GetSubjectsInfoByGroupId(int groupId)
		{
			using (var context = new LmPlatformModelsContext())
			{
					var subjectGroup = context.Set<SubjectGroup>().
						Where(sg => sg.GroupId == groupId);
					return subjectGroup.Select(sg => sg.Subject).Include(s => s.SubjectGroups).DistinctBy(x => x.Id).ToList();
			}
		}


		public int GetSubjectsCountByGroupId(int groupId, bool isActive)
		{
			using (var context = new LmPlatformModelsContext())
			{
				var subjectGroup = context.Set<SubjectGroup>().
					Where(sg => sg.GroupId == groupId && sg.IsActiveOnCurrentGroup == isActive);

				return subjectGroup.Select(sg => sg.Subject).Count();
			}
		}

		public List<Subject> GetAllSubjectsForGroup(int groupId)
		{
			using var context = new LmPlatformModelsContext();
			var subjectGroup = context.Set<SubjectGroup>()
				.Include(e => e.Subject.SubjectGroups.Select(x => x.SubjectStudents))
				.Include(e => e.Subject.Labs)
				.Include(e => e.Subject.SubjectGroups.Select(x => x.Group))
				.Include(e => e.Subject.SubjectLecturers.Select(x => x.Lecturer))
				.Include(e => e.Subject.SubjectGroups.Select(x => x.SubGroups.Select(t => t.ScheduleProtectionLabs)))
				.Include(e => e.Subject.SubjectGroups.Select(x => x.SubGroups.Select(v => v.SubjectStudents)))
				.Include(e => e.Subject.SubjectLecturers.Select(x => x.Lecturer))
				.Include(e => e.Subject.LecturesScheduleVisitings)
				.Where(e => e.GroupId == groupId).ToList();
				return subjectGroup.Select(e => e.Subject).DistinctBy(x => x.Id).ToList();
		}
			public List<Subject> GetSubjects(int groupId = 0, int lecturerId = 0)
		{
			using var context = new LmPlatformModelsContext();
			if (groupId != 0)
			{
				var subjectGroup = GetSubjectGroupQueryable(context)
					.Where(e => e.GroupId == groupId && e.IsActiveOnCurrentGroup).ToList();
				return subjectGroup.Select(e => e.Subject).DistinctBy(x => x.Id).ToList();
			}

			var subjectLecturer = GetSubjectLecturerQueryable(context)
					.Where(e => e.LecturerId == lecturerId).ToList();
			return subjectLecturer.Select(e => e.Subject).DistinctBy(x => x.Id).ToList();
		}

		public Subject GetSubject(int subjectId, int groupId = 0, int lecturerId = 0)
        {
			using var context = new LmPlatformModelsContext();
			var subjects = new List<Subject>();
			if (groupId != 0)
			{
				var subjectGroups = GetSubjectGroupQueryable(context)
					.Where(e => e.GroupId == groupId && e.IsActiveOnCurrentGroup).ToList();
				subjects = subjectGroups.Select(e => e.Subject).ToList();
			} else if (lecturerId != 0)
            {

				var subjectLecturer = GetSubjectLecturerQueryable(context)
						.Where(e => e.LecturerId == lecturerId).ToList();
				subjects = subjectLecturer.Select(e => e.Subject).ToList();
			}

			return subjects.FirstOrDefault(x => x.Id == subjectId);
		}

		private IQueryable<SubjectLecturer> GetSubjectLecturerQueryable(LmPlatformModelsContext context)
        {
			return context.Set<SubjectLecturer>()
					.Include(e => e.Subject.SubjectGroups.Select(x => x.SubjectStudents))
					.Include(e => e.Subject.Labs)
					.Include(e => e.Subject.SubjectGroups.Select(x => x.Group))
					.Include(e => e.Subject.LecturesScheduleVisitings)
					.Include(e => e.Subject.SubjectGroups.Select(x => x.Group.Students))
					.Include(e => e.Subject.SubjectGroups.Select(x => x.SubGroups.Select(t => t.ScheduleProtectionLabs)))
					.Include(e => e.Subject.SubjectLecturers.Select(x => x.Lecturer))
					.Include(e => e.Subject.SubjectLecturers.Select(x => x.OwnerLecturer));
		}

		private IQueryable<SubjectGroup> GetSubjectGroupQueryable(LmPlatformModelsContext context)
        {
			return context.Set<SubjectGroup>()
					.Include(e => e.Subject.SubjectGroups.Select(x => x.SubjectStudents))
					.Include(e => e.Subject.Labs)
					.Include(e => e.Subject.SubjectGroups.Select(x => x.Group))
					.Include(e => e.Subject.SubjectLecturers.Select(x => x.Lecturer))
					.Include(e => e.Subject.SubjectGroups.Select(x => x.SubGroups.Select(t => t.ScheduleProtectionLabs)))
					.Include(e => e.Subject.SubjectGroups.Select(x => x.SubGroups.Select(v => v.SubjectStudents)))
					.Include(e => e.Subject.SubjectLecturers.Select(x => x.Lecturer))
					.Include(e => e.Subject.LecturesScheduleVisitings);
		}


		public List<Subject> GetSubjectsV2(int groupId = 0, int lecturerId = 0)
        {
            using var context = new LmPlatformModelsContext();
            if (groupId != 0)
            {
                var subjectGroup = context.Set<SubjectGroup>()
                    .Include(e => e.Subject)
                    .Where(e => e.GroupId == groupId && e.IsActiveOnCurrentGroup && !e.Subject.IsArchive).ToList();
                return subjectGroup.Select(e => e.Subject).GroupBy(x => x.Id).Select(x => x.First())
					.DistinctBy(x => x.Id).ToList();
            }

            var subjectLecturer =
                context.Set<SubjectLecturer>()
                    .Include(e => e.Subject)
                    .Where(e => e.LecturerId == lecturerId && !e.Subject.IsArchive).ToList();
            return subjectLecturer.Select(e => e.Subject).DistinctBy(x => x.Id).ToList();
        }

        public List<Subject> GetSubjectsLite(int? groupId = null)
		{
			using var context = new LmPlatformModelsContext();
			var subjectGroup = context.Set<SubjectGroup>().Where(sg => !groupId.HasValue || (sg.GroupId == groupId.Value && sg.IsActiveOnCurrentGroup));
			return subjectGroup.Select(sg => sg.Subject).DistinctBy(x => x.Id).ToList();
		}

		public bool IsSubjectName(string name, string id, int userId)
		{
			using (var context = new LmPlatformModelsContext())
			{
				var idN = int.Parse(id);
				if (context.Set<Subject>().Include(e => e.SubjectLecturers).Any(e => e.Name == name && !e.IsArchive && e.Id != idN && e.SubjectLecturers.Any(x => x.LecturerId == userId)))
				{
					return true;
				}
			}

			return false;
		}

		public bool IsSubjectShortName(string name, string id, int userId)
		{
			using (var context = new LmPlatformModelsContext())
			{
				var idN = int.Parse(id);
				if (context.Set<Subject>().Include(e => e.SubjectLecturers).Any(e => e.ShortName == name && !e.IsArchive && e.Id != idN && e.SubjectLecturers.Any(x => x.LecturerId == userId)))
				{
					return true;
				}
			}

			return false;
		}


		public void DeleteLection(Lectures lectures)
		{
			using (var context = new LmPlatformModelsContext())
			{
				var model = context.Set<Lectures>().FirstOrDefault(e => e.Id == lectures.Id);

				context.Delete(model);

				context.SaveChanges();
			}
		}

		protected override void PerformAdd(Subject model, LmPlatformModelsContext dataContext)
		{
			base.PerformAdd(model, dataContext);

			foreach (var subjectModule in model.SubjectModules)
			{
				subjectModule.SubjectId = model.Id;
				dataContext.Set<SubjectModule>().Add(subjectModule);
			}

			foreach (var subjectGroup in model.SubjectGroups)
			{
				subjectGroup.SubjectId = model.Id;
				dataContext.Set<SubjectGroup>().Add(subjectGroup);
			}

			model.SubjectLecturers.FirstOrDefault().SubjectId = model.Id;
			dataContext.Set<SubjectLecturer>().Add(model.SubjectLecturers.FirstOrDefault());

			dataContext.SaveChanges();
		}

		protected override void PerformUpdate(Subject newValue, LmPlatformModelsContext dataContext)
		{
			var subjectModules = dataContext.Set<SubjectModule>().Where(e => e.SubjectId == newValue.Id).ToList();

			foreach (var subjectModule in subjectModules)
			{
				if (newValue.SubjectModules.All(e => e.ModuleId != subjectModule.ModuleId))
				{
					dataContext.Set<SubjectModule>().Remove(subjectModule);
				}
			}

			if (newValue.SubjectModules != null)
			{
				foreach (var subjectModule in newValue.SubjectModules)
				{
					if (subjectModules.All(e => e.ModuleId != subjectModule.ModuleId))
					{
						dataContext.Set<SubjectModule>().Add(subjectModule);
					}
				}
			}

			var subjectGroups = dataContext.Set<SubjectGroup>().Where(e => e.SubjectId == newValue.Id).ToList();

			foreach (var subjectGroup in subjectGroups)
			{
				if (newValue.SubjectGroups.All(e => e.GroupId != subjectGroup.GroupId))
				{
				    subjectGroup.IsActiveOnCurrentGroup = false;
                }
			}

			if (newValue.SubjectGroups != null)
			{
				foreach (var subjectGroup in newValue.SubjectGroups)
				{
				    var oldSubjectGroup = dataContext.Set<SubjectGroup>().FirstOrDefault(e =>
				        e.SubjectId == subjectGroup.SubjectId && e.GroupId == subjectGroup.GroupId);
				    if (oldSubjectGroup != null)
				    {
				        oldSubjectGroup.IsActiveOnCurrentGroup = true;
				    }
				    else if (subjectGroups.All(e => e.GroupId != subjectGroup.GroupId))
					{
						dataContext.Set<SubjectGroup>().Add(subjectGroup);
					}
				}
			}

			dataContext.SaveChanges();

			base.PerformUpdate(newValue, dataContext);
		}

		public void DisableNews(int subjectId, bool disable)
		{
			using var context = new LmPlatformModelsContext();
			var models = context.Set<SubjectNews>().Where(e => e.SubjectId == subjectId);

			foreach (var subjectNewse in models)
			{
				subjectNewse.Disabled = disable;
			}

			context.Update(models);
			context.SaveChanges();
		}
	}
}