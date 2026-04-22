using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using Application.Core;
using Application.Core.Data;
using Application.Core.Extensions;
using Application.Infrastructure.DTO;
using LMPlatform.Data.Infrastructure;
using LMPlatform.Models.DP;

namespace Application.Infrastructure.DPManagement
{
    public class DpPercentageGraphService : IDpPercentageGraphService
    {
        private readonly LazyDependency<IDpContext> context = new LazyDependency<IDpContext>();

        private IDpContext Context
        {
            get { return context.Value; }
        }

        public PagedList<PercentageGraphData> GetPercentageGraphs(int userId, GetPagedListParams parms)
        {
            var groupId = 0;
            if (parms.Filters.ContainsKey("groupId"))
            {
                int.TryParse(parms.Filters["groupId"], out groupId);
            }

            var user = Context.Users
                .Include(x => x.Student.Group)
                .Include(x => x.Lecturer)
                .Single(x => x.Id == userId);

            var isLecturer = user.Lecturer != null;
            var isStudent = user.Student != null;
            var isSecretary = isLecturer && user.Lecturer.IsSecretary;

            var isThesisLecturer = isLecturer && Context.DiplomProjectGroups
                .Any(dpg => dpg.DiplomProject.LecturerId == userId);

            if (isSecretary && isThesisLecturer)
            {
                var lecturerItems = GetPercentageGraphDataForLecturerQuery(userId, groupId).ToList();
                var ownItems = Context.DiplomPercentagesGraphs
                    .AsNoTracking()
                    .Include(x => x.DiplomPercentagesGraphToGroups)
                    .Where(x => x.LecturerId == userId)
                    .Select(ToPercentageData)
                    .ToList();

                var merged = lecturerItems
                    .Union(ownItems, new PercentageGraphDataComparer())
                    .OrderBy(x => x.Date)
                    .ToList();

                return new PagedList<PercentageGraphData>
                {
                    Items = merged,
                    Total = merged.Count
                };
            }

            if (isSecretary)
            {
                return Context.DiplomPercentagesGraphs
                    .AsNoTracking()
                    .Include(x => x.DiplomPercentagesGraphToGroups)
                    .Where(x => x.LecturerId == userId)
                    .Select(ToPercentageData)
                    .ApplyPaging(parms);
            }

            if (isThesisLecturer)
            {
                parms.SortExpression = "Date";
                return GetPercentageGraphDataForLecturerQuery(userId, groupId).ApplyPaging(parms);
            }

            if (isLecturer)
            {
                parms.SortExpression = "Date";
                return GetPercentageGraphDataForLecturerQuery(userId, groupId).ApplyPaging(parms);
            }

            var secretaryId = user.Student.Group.SecretaryId;

            return Context.DiplomPercentagesGraphs
                .AsNoTracking()
                .Include(x => x.DiplomPercentagesGraphToGroups)
                .Where(x => x.DiplomPercentagesGraphToGroups
                    .Any(g => g.Group.SecretaryId == secretaryId))
                .Select(ToPercentageData)
                .ApplyPaging(parms);
        }

        public class PercentageGraphDataComparer : IEqualityComparer<PercentageGraphData>
        {
            public bool Equals(PercentageGraphData x, PercentageGraphData y)
            {
                if (x == null || y == null) return false;
                return x.Id == y.Id;
            }

            public int GetHashCode(PercentageGraphData obj)
            {
                return obj.Id.GetHashCode();
            }
        }

        public PagedList<PercentageGraphData> GetPercentageGraphsForLecturer(int lecturerId, GetPagedListParams parms, int secretaryId)
        {
            AuthorizationHelper.ValidateLecturerAccess(Context, lecturerId);

            parms.SortExpression = "Date";
            return GetPercentageGraphDataForLecturerQuery(lecturerId, secretaryId).ApplyPaging(parms);
        }

        public List<PercentageGraphData> GetPercentageGraphsForLecturerAll(int userId, GetPagedListParams parms)
        {
            var secretaryId = 0;
            if (parms.Filters.ContainsKey("secretaryId"))
            {
                int.TryParse(parms.Filters["secretaryId"], out secretaryId);
            }

            var isSecretary = false;
            if (parms.Filters.ContainsKey("isSecretary"))
            {
                isSecretary = bool.Parse(parms.Filters["isSecretary"]);
            }

            var isStudent = AuthorizationHelper.IsStudent(Context, userId);
            var isLecturer = AuthorizationHelper.IsLecturer(Context, userId);
            var isLecturerSecretary = isLecturer && Context.Lecturers.Single(x => x.Id == userId).IsSecretary;
            isLecturerSecretary = isSecretary;
            secretaryId = isLecturerSecretary ? userId : secretaryId;

            if (isStudent)
            {
                secretaryId = Context.Users.Where(x => x.Id == userId).Select(x => x.Student.Group.SecretaryId).Single() ?? 0;
            }

            return GetPercentageGraphDataForLecturerQuery(isLecturerSecretary || isStudent ? 0 : userId, secretaryId)
                .Where(x => x.Date >= _currentAcademicYearStartDate && x.Date < _currentAcademicYearEndDate)
                .OrderBy(x => x.Date)
                .ToList();
        }

        public List<string> GetDpPercentageDate(int userId, GetPagedListParams parms)
        {
            var graphData = GetPercentageGraphsForLecturerAll(userId, parms);
            var data = new List<string>();

            foreach (var dp in graphData)
            {
                data.Add(dp.Date.ToString("dd/MM/yyyy"));
            }

            return data;
        }

        public void UpdateConsultationDate(int userId, int id, DateTime day, TimeSpan? startTime, TimeSpan? endTime, string audience, string building)
        {
            var entity = Context.DiplomProjectConsultationDates.FirstOrDefault(x => x.Id == id);

            if (entity == null)
                throw new Exception("Consultation not found");

            entity.Day = day;
            entity.StartTime = startTime;
            entity.EndTime = endTime;
            entity.Audience = audience;
            entity.Building = building;

            Context.SaveChanges();
        }
        public List<DiplomProjectConsultationDateData> GetConsultationDatesForUser(int userId)
        {
            if (AuthorizationHelper.IsStudent(Context, userId))
            {
                var student = Context.Students
                    .Include(x => x.AssignedDiplomProjects.Select(adp => adp.DiplomProject))
                    .Single(x => x.User.Id == userId);
                if (student.AssignedDiplomProjects.Count == 0)
                {
                    return new List<DiplomProjectConsultationDateData>();
                }

                userId = student.AssignedDiplomProjects.First().DiplomProject.LecturerId ?? 0;
            }

            return Context.DiplomProjectConsultationDates
    .Where(x => x.Day >= _currentAcademicYearStartDate && x.Day < _currentAcademicYearEndDate)
    .Where(x => x.LecturerId == userId)
    .Join(Context.Lecturers,
        c => c.LecturerId,
        l => l.Id,
        (c, l) => new
        {
            Consultation = c,
            Lecturer = l
        })
    .AsEnumerable()
    .Select(x => new DiplomProjectConsultationDateData
    {
        Id = x.Consultation.Id,
        LecturerId = x.Consultation.LecturerId,

        LecturerFullName = x.Lecturer.FullName,

        Day = x.Consultation.Day,
        StartTime = x.Consultation.StartTime,
        EndTime = x.Consultation.EndTime,
        Audience = x.Consultation.Audience,
        Building = x.Consultation.Building
    })
    .OrderBy(x => x.Day)
    .ToList();
        }

        /// <summary>
        /// Lecturer.DiplomProjects=>Groups.Secretary.PercentageGraphs
        /// </summary>
        /// <param name="lecturerId"></param>
        /// <param name="secretaryId"></param>
        /// <returns></returns>
        private IQueryable<PercentageGraphData> GetPercentageGraphDataForLecturerQuery(int lecturerId, int groupId)
        {
            var lecturerGroupIds = Context.DiplomProjectGroups
                .Where(dpg => lecturerId == 0 || dpg.DiplomProject.LecturerId == lecturerId)
                .Select(dpg => dpg.GroupId)
                .Distinct()
                .ToList();

            if (!lecturerGroupIds.Any())
                return Enumerable.Empty<PercentageGraphData>().AsQueryable();

            var secretaryIds = Context.Groups
                .Where(g => lecturerGroupIds.Contains(g.Id) && g.SecretaryId != null)
                .Select(g => g.SecretaryId.Value)
                .Distinct()
                .ToList();
            System.Diagnostics.Debug.WriteLine("secretaryIds: " + string.Join(", ", secretaryIds));
            System.Diagnostics.Debug.WriteLine("lecturerGroupIds: " + string.Join(", ", lecturerGroupIds));
            if (!secretaryIds.Any())
                return Enumerable.Empty<PercentageGraphData>().AsQueryable();

            return Context.DiplomPercentagesGraphs
                .Where(x => secretaryIds.Contains(x.LecturerId)
                    && x.DiplomPercentagesGraphToGroups
                        .Any(g => lecturerGroupIds.Contains(g.GroupId)
                            && (groupId == 0 || g.GroupId == groupId)))
                .Distinct()
                .Select(ToPercentageData);
        }

        public PercentageGraphData GetPercentageGraph(int id)
        {
            return Context.DiplomPercentagesGraphs
                .AsNoTracking()
                .Include(x => x.DiplomPercentagesGraphToGroups)
                .Select(ToPercentageData)
                .Single(x => x.Id == id);
        }

        public void SavePercentage(int userId, PercentageGraphData percentageData)
        {
            AuthorizationHelper.ValidateLecturerAccess(Context, userId);

            var exists = Context.DiplomPercentagesGraphs.Any(x =>
                x.Name == percentageData.Name &&
                x.Id != percentageData.Id
            );

            if (exists)
            {
                throw new ApplicationException("Этап с таким названием уже есть!");
            }

            DiplomPercentagesGraph percentage;
            if (percentageData.Id.HasValue)
            {
                percentage = Context.DiplomPercentagesGraphs
                    .Include(x => x.DiplomPercentagesGraphToGroups)
                    .Single(x => x.Id == percentageData.Id.Value);

                percentage.DiplomPercentagesGraphToGroups.Clear();
            }
            else
            {
                percentage = new DiplomPercentagesGraph
                {
                    DiplomPercentagesGraphToGroups = new List<DiplomPercentagesGraphToGroup>()
                };
                Context.DiplomPercentagesGraphs.Add(percentage);
            }

            percentage.LecturerId = userId;
            percentage.Name = percentageData.Name;
            percentage.Percentage = percentageData.Percentage;
            percentage.Date = percentageData.Date;

            if (percentageData.SelectedGroupsIds != null)
            {
                foreach (var groupId in percentageData.SelectedGroupsIds)
                {
                    percentage.DiplomPercentagesGraphToGroups.Add(new DiplomPercentagesGraphToGroup
                    {
                        GroupId = groupId,
                        DiplomPercentagesGraph = percentage
                    });
                }
            }

            Context.SaveChanges();
        }

        public void DeletePercentage(int userId, int id)
        {
            AuthorizationHelper.ValidateLecturerAccess(Context, userId);

            var percentage = Context.DiplomPercentagesGraphs.Single(x => x.Id == id);
            Context.DiplomPercentagesGraphs.Remove(percentage);
            Context.SaveChanges();
        }

        public void SavePercentageResult(int userId, PercentageResultData percentageResultData)
        {
            AuthorizationHelper.ValidateLecturerAccess(Context, userId);

            DiplomPercentagesResult result;

            if (percentageResultData.Id.HasValue)
            {
                result = Context.DiplomPercentagesResults
                    .Single(x => x.Id == percentageResultData.Id.Value);
            }
            else
            {
                result = new DiplomPercentagesResult
                {
                    StudentId = percentageResultData.StudentId,
                    DiplomPercentagesGraphId = percentageResultData.PercentageGraphId
                };

                Context.DiplomPercentagesResults.Add(result);
            }

            result.Mark = percentageResultData.Mark;
            result.Comments = percentageResultData.Comment;
            result.ShowForStudent = percentageResultData.ShowForStudent;

            Context.SaveChanges();
        }

        public void SaveConsultationMark(int userId, DiplomProjectConsultationMarkData consultationMarkData)
        {
            AuthorizationHelper.ValidateLecturerAccess(Context, userId);

            DiplomProjectConsultationMark consultationMark;
            if (consultationMarkData.Id.HasValue)
            {
                consultationMark = Context.DiplomProjectConsultationMarks
                    .Single(x => x.Id == consultationMarkData.Id);
            }
            else
            {
                consultationMark = new DiplomProjectConsultationMark
                {
                    StudentId = consultationMarkData.StudentId,
                    ConsultationDateId = consultationMarkData.ConsultationDateId
                };
                Context.DiplomProjectConsultationMarks.Add(consultationMark);
            }

            consultationMark.Mark = string.IsNullOrWhiteSpace(consultationMarkData.Mark) ? null : consultationMarkData.Mark;

            consultationMark.Comments = consultationMarkData.Comments;
            Context.SaveChanges();
        }

        public void SaveConsultationDate(int userId, DateTime date, TimeSpan? startTime, TimeSpan? endTime, string audience, string buildingNumber)
        {
            AuthorizationHelper.ValidateLecturerAccess(Context, userId);

            Context.DiplomProjectConsultationDates.Add(new DiplomProjectConsultationDate
            {
                Day = date,
                LecturerId = userId,
                StartTime = startTime,
                EndTime = endTime,
                Audience = audience,
                Building = buildingNumber
            });

            Context.SaveChanges();
        }

        public void DeleteConsultationDate(int userId, int id)
        {
            AuthorizationHelper.ValidateLecturerAccess(Context, userId);

            var consultation = Context.DiplomProjectConsultationDates.Single(x => x.Id == id);
            Context.DiplomProjectConsultationDates.Remove(consultation);
            Context.SaveChanges();
        }

        private static readonly Expression<Func<DiplomPercentagesGraph, PercentageGraphData>> ToPercentageData =
            x => new PercentageGraphData
        {
            Id = x.Id,
            Date = x.Date,
            Name = x.Name,
            Percentage = x.Percentage,
            SelectedGroupsIds = x.DiplomPercentagesGraphToGroups.Select(dpg => dpg.GroupId)
        };

        private static readonly Expression<Func<DiplomPercentagesGraph, PercentageGraphData>> ToPercentageDataPlain =
            x => new PercentageGraphData
        {
            Id = x.Id,
            Date = x.Date,
            Name = x.Name,
            Percentage = x.Percentage,
        };

        private readonly DateTime _currentAcademicYearStartDate = DateTime.Now.Month < 9
            ? new DateTime(DateTime.Now.Year - 1, 9, 1)
            : new DateTime(DateTime.Now.Year, 9, 1);

        private readonly DateTime _currentAcademicYearEndDate = DateTime.Now.Month < 9
            ? new DateTime(DateTime.Now.Year, 9, 1)
            : new DateTime(DateTime.Now.Year + 1, 9, 1);
    }
}