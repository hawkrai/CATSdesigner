using System;
using System.Collections.Generic;
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

        public ParentalResult LoadGroup(string groupId)
        {
            try
            {
                using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
                {
                    var id = int.Parse(groupId);
                    var group = repositoriesContainer.GroupsRepository.GetBy(new Query<Group>(e => e.Id == id)
                        .Include(e => e.Students.Select(x => x.LecturesVisitMarks.Select(t => t.LecturesScheduleVisiting)))
                        .Include(e => e.Students.Select(x => x.ScheduleProtectionLabMarks.Select(t => t.ScheduleProtectionLab).Select(f => f.SubGroup).Select(s => s.SubjectGroup)))
                        .Include(e => e.Students.Select(x => x.StudentLabMarks.Select(t => t.Lab))));
                    var subjects = SubjectManagementService.GetGroupSubjects(id);
                    var students = group.Students.ToList();
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
    }
}
