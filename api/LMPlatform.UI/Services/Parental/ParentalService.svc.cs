using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Application.Core;
using Application.Core.Data;
using Application.Core.Extensions;
using Application.Core.Helpers;
using Application.Infrastructure.GroupManagement;
using Application.Infrastructure.SubjectManagement;
using LMPlatform.Data.Repositories;
using LMPlatform.Models;
using LMPlatform.UI.Attributes;
using LMPlatform.UI.Services.Modules;
using LMPlatform.UI.Services.Modules.Parental;
using Microsoft.AspNet.SignalR;

namespace LMPlatform.UI.Services.Parental
{
    [JwtAuth]
    public class ParentalService : IParentalService
    {
        private readonly LazyDependency<ISubjectManagementService> subjectManagementService = new LazyDependency<ISubjectManagementService>();
        public ISubjectManagementService SubjectManagementService => subjectManagementService.Value;

        private readonly LazyDependency<IGroupManagementService> groupManagementService = new LazyDependency<IGroupManagementService>();
        public IGroupManagementService GroupManagementService => groupManagementService.Value;

        public SubjectListResult GetGroupSubjectsByGroupName(string groupName)
        {
            try
            {
                var group = GroupManagementService.GetGroupByName(groupName);
                var model = SubjectManagementService.GetGroupSubjectsLite(group.Id); // lite

                var result = new SubjectListResult
                {
                    Subjects = model.Select(e => new SubjectViewData(e)).ToList(),
                    GroupId = group.Id,
                    Message = "Данные успешно загружены",
                    Code = "200"
                };

                return result;
            }
            catch
            {
                return new SubjectListResult
                {
                    Message = "Произошла ошибка при получении данных",
                    Code = "500"
                };
            }
        }

        public ParentalResult LoadGroup(string groupId, string isArchive, string startDate, string endDate)
        {
            try
            {
                using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
                {
                    var id = int.Parse(groupId);
                    bool.TryParse(isArchive, out var archive);
                    var group = repositoriesContainer.GroupsRepository.GetBy(new Query<Group>(e => e.Id == id)
                        .Include(e => e.Students.Select(x => x.LecturesVisitMarks.Select(t => t.LecturesScheduleVisiting)))
                        .Include(e => e.Students.Select(x => x.ScheduleProtectionLabMarks.Select(t => t.ScheduleProtectionLab).Select(f => f.SubGroup).Select(s => s.SubjectGroup)))
                        .Include(e => e.Students.Select(x => x.StudentLabMarks.Select(t => t.Lab)))
                        .Include(e => e.Students.Select(x => x.ScheduleProtectionPracticalMarks.Select(t => t.ScheduleProtectionPractical).Select(s => s.Group).Select(s => s.SubjectGroups)))
                        .Include(e => e.Students.Select(x => x.StudentPracticalMarks.Select(x => x.Practical)))
                        .Include(e => e.Students.Select(x => x.CoursePercentagesResults.Select(x => x.CoursePercentagesGraph)))
                        .Include(e => e.Students.Select(x => x.AssignedCourseProjects.Select(x => x.CourseProject))));
                    var subjects = SubjectManagementService.GetGroupSubjects(id, archive);
                    var students = group.Students.Where(student => student.Confirmed.HasValue && student.Confirmed.Value).ToList();

                    var resultModel = LoadResult(startDate, endDate, students, subjects);
                    resultModel.GroupName = group.Name;
                    return resultModel;
                }
            }
            catch (Exception ex)
            {
                return new ParentalResult
                {
                    Message = ex.Message + ex.StackTrace,
                    Code = "500"
                };
            }

        }

        public ParentalResult LoadStudent(string isArchive, string startDate, string endDate)
        {
            try
            {
                if (UserContext.Role != "student")
                {
                    throw new Exception("User not a student");
                }
                bool.TryParse(isArchive, out var archive);

                using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
                {
                    var user = repositoriesContainer.UsersRepository.GetBy(new Query<User>(e => e.Id == UserContext.CurrentUserId)
                        .Include(e => e.Student)
                        .Include(e => e.Student.Group)
                        .Include(e => e.Student.LecturesVisitMarks.Select(t => t.LecturesScheduleVisiting))
                        .Include(e => e.Student.ScheduleProtectionLabMarks.Select(t => t.ScheduleProtectionLab).Select(f => f.SubGroup).Select(s => s.SubjectGroup))
                        .Include(e => e.Student.StudentLabMarks.Select(t => t.Lab))
                        .Include(e => e.Student.ScheduleProtectionPracticalMarks.Select(t => t.ScheduleProtectionPractical).Select(f => f.Group).Select(s => s.SubjectGroups))
                        .Include(e => e.Student.StudentPracticalMarks.Select(t => t.Practical))
                        .Include(e => e.Student.CoursePercentagesResults.Select(t => t.CoursePercentagesGraph))
                        .Include(e => e.Student.AssignedCourseProjects.Select(t => t.CourseProject))
                        );
                    var subjects = repositoriesContainer.RepositoryFor<SubjectGroup>().GetAll(new Query<SubjectGroup>(x => x.GroupId == user.Student.GroupId && x.IsActiveOnCurrentGroup && x.Subject.IsArchive == archive).Include(e => e.Subject))
                        .ToList()
                        .Select(e => e.Subject).GroupBy(x => x.Id).Select(x => x.First())
                        .DistinctBy(x => x.Id)
                        .ToList();
                    var resultModel = LoadResult(startDate, endDate, new List<Student> { user.Student }, subjects);
                    resultModel.UserName = user.UserName;
                    resultModel.GroupName = user.Student.Group.Name;
                    return resultModel;
                }
            }
            catch (Exception ex)
            {
                return new ParentalResult
                {
                    Message = ex.Message + ex.StackTrace,
                    Code = "500"
                };
            }
        }

        private ParentalResult LoadResult(string startDate, string endDate, List<Student> students, List<Subject> subjects)
        {
            var dateStart = string.IsNullOrWhiteSpace(startDate) ? new DateTime?() : DateTime.ParseExact(startDate, "dd-MM-yyyy", CultureInfo.InvariantCulture);
            var dateEnd = string.IsNullOrWhiteSpace(endDate) ? new DateTime?() : DateTime.ParseExact(endDate, "dd-MM-yyyy", CultureInfo.InvariantCulture);
            students = students.Select(student =>
            {
                student.LecturesVisitMarks = student.LecturesVisitMarks.Where(x => GetDateCondition(x.LecturesScheduleVisiting.Date, dateStart, dateEnd)).ToList();
                student.StudentLabMarks = student.StudentLabMarks.Where(x =>
                {
                    var parsed = DateTime.TryParseExact(x.Date, new string[] { "dd.MM.yyyy", "dd/MM/yyyy" }, CultureInfo.InvariantCulture, DateTimeStyles.None, out var date);
                    return GetDateCondition(parsed ? date : new DateTime?(), dateStart, dateEnd);
                }).ToList();
                student.StudentPracticalMarks = student.StudentPracticalMarks.Where(x =>
                {
                    var parsed = DateTime.TryParseExact(x.Date, new string[] { "dd.MM.yyyy", "dd/MM/yyyy" }, CultureInfo.InvariantCulture, DateTimeStyles.None, out var date);
                    return GetDateCondition(parsed ? date : new DateTime?(), dateStart, dateEnd);
                }).ToList();
                student.ScheduleProtectionLabMarks = student.ScheduleProtectionLabMarks.Where(x => GetDateCondition(x.ScheduleProtectionLab?.Date, dateStart, dateEnd)).ToList();
                student.ScheduleProtectionPracticalMarks = student.ScheduleProtectionPracticalMarks.Where(x => GetDateCondition(x.ScheduleProtectionPractical?.Date, dateStart, dateEnd)).ToList();
                student.CoursePercentagesResults = student.CoursePercentagesResults.Where(x => GetDateCondition(x.CoursePercentagesGraph.Date, dateStart, dateEnd)).ToList();
                student.AssignedCourseProjects = student.AssignedCourseProjects.Where(x => GetDateCondition(x.MarkDate, dateStart, dateEnd)).ToList();
                return student;
            }).ToList();
            students.Sort((arg1, arg2) => { return string.Compare(arg1.FullName, arg2.FullName); });



            return new ParentalResult
            {
                Students = students.Select(e => new ParentalUser(e, subjects)).ToList(),
                Message = "Ok",
                Code = "200"
            };
        }


        private bool GetDateCondition(DateTime? date, DateTime? startDate, DateTime? endDate)
        {
            if (!date.HasValue)
            {
                return false;
            }
            var normalizedDate = date.Value.Date;
            if (startDate.HasValue && endDate.HasValue)
            {
                return normalizedDate >= startDate.Value.Date && normalizedDate <= endDate.Value.Date;
            }
            else if (startDate.HasValue)
            {
                return normalizedDate >= startDate.Value.Date;
            }
            else if (endDate.HasValue)
            {
                return normalizedDate <= endDate.Value.Date;
            }
            return true;
        }
    }
}
