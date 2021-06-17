using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using Application.Core;
using Application.Infrastructure.DTO;
using LMPlatform.Data.Infrastructure;

namespace Application.Infrastructure.DPManagement
{
    public class CorrelationService : ICorrelationService
    {
        public CorrelationService()
        {
            _correlationMethodsMapping = new Dictionary<string, Func<int?, List<Correlation>>>
            {
                { "Group", GetGroupsCorrelation },
                { "DiplomProject", GetDiplomProjectCorrelation },
                { "DiplomLecturer", GetDiplomLecturerCorrelation },
                { "LecturerDiplomGroup", GetLecturerDiplomGroupsCorrelation },
                { "DiplomProjectTaskSheetTemplate", GetDiplomProjectTaskSheetTemplateCorrelation },
                { "LecturerForSecretary", GetLecturerForSecretary},
            };
        }

        private readonly LazyDependency<IDpContext> context = new LazyDependency<IDpContext>();

        private IDpContext Context
        {
            get { return context.Value; }
        }

        private readonly Dictionary<string, Func<int?, List<Correlation>>> _correlationMethodsMapping;

        public List<Correlation> GetCorrelation(string entity, int? id)
        {
            if (!_correlationMethodsMapping.ContainsKey(entity))
            {
                throw new Exception("CorrelationService doesn't serve this entity type!");
            }

            return _correlationMethodsMapping[entity](id);
        }

        private List<Correlation> GetGroupsCorrelation(int? userId)
        {
            var groups = Context.GetGraduateGroups();

            if (userId.HasValue)
            {
                var user = Context.Users.Include(x => x.Lecturer).Single(x => x.Id == userId);
                var isSecretary = user.Lecturer != null && user.Lecturer.IsSecretary;
                if (isSecretary)
                {
                    groups = groups.Where(x => !x.SecretaryId.HasValue || x.SecretaryId == userId);
                }
            }

            return groups.OrderBy(x => x.Name).Select(x => new Correlation
                {
                    Id = x.Id,
                    Name = x.Name
                }).ToList();
        }

        /// <summary>
        /// Lecturer.AssignedProjects.Students.Groups.Secretary
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        private List<Correlation> GetLecturerDiplomGroupsCorrelation(int? id)
        {
            if (!id.HasValue)
            {
                throw new ApplicationException("userId cant be null!");
            }

            return AuthorizationHelper.IsLecturer(Context, id.Value)
                ? Context.Lecturers
                    .Include(
                        x =>
                            x.DiplomProjects.Select(
                                dp => dp.AssignedDiplomProjects.Select(adp => adp.Student.Group.Secretary)))
                    .Single(x => x.Id == id)
                    .DiplomProjects.Where(dp => dp.AssignedDiplomProjects.Any())
                    .SelectMany(dp => dp.AssignedDiplomProjects.Select(ap => ap.Student.Group))
                    .Where(x => x.Secretary != null)
                    .GroupBy(x => x.Secretary, (secretary, groups) => new { secretary, groups })
                    .ToList().Select(x => new Correlation
                    {
                        Id = x.secretary.Id,
                        Name = string.Format("{0} ({1})", x.secretary.FullName, string.Join(", ", x.groups.Select(g => g.Name).Distinct()))
                    }).ToList()
                : AuthorizationHelper.IsStudent(Context, id.Value)
                    ? Context.Students.Where(x => x.Id == id).Select(x => x.Group.Secretary).Where(x => x != null).ToList()
                    .Select(x => new Correlation
                    {
                        Id = x.Id,
                        Name = x.FullName
                    }).ToList() : new List<Correlation>();
        }

        public List<Correlation> GetLecturerForSecretary(int? id)
        {
            if (!id.HasValue)
            {
                throw new ApplicationException("userId cant be null!");
            }

            var currentYear = _currentAcademicYearEndDate.Year.ToString();

            return Context.DiplomProjects.AsNoTracking()
                .Include(x => x.Lecturer)
                .Include(x => x.AssignedDiplomProjects.Select(asp => asp.Student.Group))
                .Where(x => x.AssignedDiplomProjects.Any())
                .Where(x => x.AssignedDiplomProjects.FirstOrDefault().Student.Group.GraduationYear == currentYear
                && x.AssignedDiplomProjects.FirstOrDefault().Student.Group.SecretaryId == id)
                .Select(x => x.Lecturer).Distinct().ToList()
                .Select(x => new Correlation
                 {
                     Id = x.Id,
                     Name = x.FullName
                 }).ToList();
        }

        private List<Correlation> GetDiplomProjectTaskSheetTemplateCorrelation(int? id)
        {
            return Context.DiplomProjectTaskSheetTemplates
                    .Select(x => new Correlation
                    {
                        Id = x.Id,
                        Name = x.Name
                    })
                    .OrderBy(x => x.Name)
                    .ToList();
        }

        private List<Correlation> GetDiplomProjectCorrelation(int? lecturerId)
        {
            var projects = lecturerId.HasValue ? Context.DiplomProjects.Where(x => x.LecturerId == lecturerId) : Context.DiplomProjects;
            var user = Context.Users.Include(x => x.Student).Include(x => x.Lecturer).SingleOrDefault(x => x.Id == lecturerId);

            if (projects.ToList().Count == 0 && user != null && user.Student != null)
            {
                projects = Context.DiplomProjects.Where(x => x.AssignedDiplomProjects.Any(q => q.StudentId == user.Student.Id));

                if (projects.ToList().Count == 0)
                {
                    projects = Context.DiplomProjects.Where(x => x.DiplomProjectGroups.Any(dpg => dpg.GroupId == user.Student.GroupId));
                }
            }

            return projects.Select(x => new Correlation
                {
                    Id = x.DiplomProjectId,
                    Name = x.Theme
                }).OrderBy(x => x.Name).ToList();
        }

        private List<Correlation> GetDiplomLecturerCorrelation(int? id)
        {
            return Context.Lecturers
                .Where(x => x.IsLecturerHasGraduateStudents && x.DiplomProjects.Any(dp => dp.AssignedDiplomProjects.Any()))
                .ToList()
                .Select(x => new Correlation
                {
                    Id = x.Id,
                    Name = x.FullName
                }).OrderBy(x => x.Name).ToList();
        }

        private readonly DateTime _currentAcademicYearStartDate = DateTime.Now.Month < 9
            ? new DateTime(DateTime.Now.Year - 1, 9, 1)
            : new DateTime(DateTime.Now.Year, 9, 1);

        private readonly DateTime _currentAcademicYearEndDate = DateTime.Now.Month < 9
            ? new DateTime(DateTime.Now.Year, 9, 1)
            : new DateTime(DateTime.Now.Year + 1, 9, 1);
    }
}