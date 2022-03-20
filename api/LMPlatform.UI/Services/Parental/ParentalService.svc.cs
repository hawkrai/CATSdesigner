using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Application.Core;
using Application.Core.Data;
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
                    var dateStart = string.IsNullOrWhiteSpace(startDate) ? new DateTime?() : DateTime.ParseExact(startDate, "dd-MM-yyyy", CultureInfo.InvariantCulture);
                    var dateEnd = string.IsNullOrWhiteSpace(endDate) ? new DateTime?() : DateTime.ParseExact(endDate, "dd-MM-yyyy", CultureInfo.InvariantCulture);
                    bool.TryParse(isArchive, out var archive);
                    var group = repositoriesContainer.GroupsRepository.GetBy(new Query<Group>(e => e.Id == id)
                        .Include(e => e.Students.Select(x => x.LecturesVisitMarks.Select(t => t.LecturesScheduleVisiting)))
                        .Include(e => e.Students.Select(x => x.ScheduleProtectionLabMarks.Select(t => t.ScheduleProtectionLab).Select(f => f.SubGroup).Select(s => s.SubjectGroup)))
                        .Include(e => e.Students.Select(x => x.StudentLabMarks.Select(t => t.Lab)))
                        .Include(e => e.Students.Select(x => x.ScheduleProtectionPracticalMarks.Select(t => t.ScheduleProtectionPractical).Select(s => s.Group).Select(s => s.SubjectGroups)))
                        .Include(e => e.Students.Select(x => x.StudentPracticalMarks.Select(x => x.Practical)))
                        .Include(e => e.Students.Select(x => x.CoursePercentagesResults.Select(x => x.CoursePercentagesGraph)))
                        .Include(e => e.Students.Select(x => x.AssignedCourseProjects.Select(x => x.CourseProject)))); ;
                    var subjects = SubjectManagementService.GetGroupSubjects(id, archive);
                    var students = group.Students.Where(student => student.Confirmed.HasValue && student.Confirmed.Value).Select(student =>
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
                        GroupName = group.Name,
                        Message = "Ok",
                        Code = "200"
                    };
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
