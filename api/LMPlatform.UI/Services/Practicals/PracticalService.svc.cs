using System;
using System.Collections.Generic;
using System.Linq;
using Application.Core;
using Application.Core.Data;
using Application.Core.Helpers;
using Application.Infrastructure.GroupManagement;
using Application.Infrastructure.SubjectManagement;
using LMPlatform.Models;
using LMPlatform.UI.Attributes;
using LMPlatform.UI.Services.Modules;
using LMPlatform.UI.Services.Modules.CoreModels;
using LMPlatform.UI.Services.Modules.Practicals;
using Newtonsoft.Json;
using WebMatrix.WebData;

namespace LMPlatform.UI.Services.Practicals
{
    [JwtAuth]
    public class PracticalService : IPracticalService
    {
        private readonly LazyDependency<ISubjectManagementService> subjectManagementService = new LazyDependency<ISubjectManagementService>();

        public ISubjectManagementService SubjectManagementService => subjectManagementService.Value;


        private readonly LazyDependency<IGroupManagementService> groupManagementService = new LazyDependency<IGroupManagementService>();

        public IGroupManagementService GroupManagementService => groupManagementService.Value;

        private const int PracticalModuleId = 13;

        public PracticalsResult GetLabs(string subjectId)
        {
            try
            {
	            var id = int.Parse(subjectId);
	            var query = new Query<Subject>(s => s.Id == id)
	                .Include(s => s.SubjectModules)
	                .Include(s => s.Practicals);
                var sub = SubjectManagementService.GetSubject(query);
                var model = new List<PracticalsViewData>();
                if (sub.SubjectModules.Any(e => e.ModuleId == PracticalModuleId))
                {
                    model = sub.Practicals.Select(e => new PracticalsViewData(e)).ToList();
                }

                return new PracticalsResult
                {
                    Practicals = model.OrderBy(x => x.Order).ToList(),
                    Message = "Практические занятия успешно загружены",
                    Code = "200"
                };
            }
            catch
            {
                return new PracticalsResult
                {
                    Message = "Произошла ошибка при получении практических занятий",
                    Code = "500"
                };
            }
        }

        public ResultViewData Save(int subjectId, int id, string theme, int duration, int order, string shortName, string pathFile, string attachments)
        {
            try
            {
                var isUserAssigned = SubjectManagementService.IsUserAssignedToSubject(UserContext.CurrentUserId, subjectId);
                if (!isUserAssigned)
                {
                    return new ResultViewData
                    {
                        Code = "500",
                        Message = "Пользователь не присоединён к предмету"
                    };
                }
                var attachmentsModel = JsonConvert.DeserializeObject<List<Attachment>>(attachments).ToList();
                SubjectManagementService.SavePractical(new Practical
                {
                    SubjectId = subjectId,
                    Duration = duration,
                    Theme = theme,
                    Order = order,
                    ShortName = shortName,
                    Attachments = pathFile,
                    Id = id
                }, attachmentsModel, UserContext.CurrentUserId);
                return new ResultViewData
                {
                    Message = "Практическое занятие успешно сохранено",
                    Code = "200"
                };
            }
            catch
            {
                return new ResultViewData
                {
                    Message = "Произошла ошибка при сохранении практического занятия",
                    Code = "500"
                };
            }
        }

        public ResultViewData Delete(int id, int subjectId)
        {
            try
            {
                var isUserAssigned = SubjectManagementService.IsUserAssignedToSubject(UserContext.CurrentUserId, subjectId);
                if (!isUserAssigned)
                {
                    return new ResultViewData
                    {
                        Code = "500",
                        Message = "Пользователь не присоединён к предмету"
                    };
                }
                SubjectManagementService.DeletePracticals(id);
                return new ResultViewData
                {
                    Message = "Практическое занятие успешно удалено",
                    Code = "200"
                };
            }
            catch (Exception e)
            {
                return new ResultViewData
                {
                    Message = "Произошла ошибка при удалении практического занятия" + e.Message,
                    Code = "500"
                };
            }
        }

        public ResultViewData SaveScheduleProtectionDate(int groupId, string date, int subjectId)
        {
            try
            {
                var isUserAssigned = SubjectManagementService.IsUserAssignedToSubject(UserContext.CurrentUserId, subjectId);
                if (!isUserAssigned)
                {
                    return new ResultViewData
                    {
                        Code = "500",
                        Message = "Пользователь не присоединён к предмету"
                    };
                }
                SubjectManagementService.SaveScheduleProtectionPracticalDate(new ScheduleProtectionPractical
                {
                    GroupId = groupId,
                    Date = DateTime.Parse(date),
                    SubjectId = subjectId
                });
                return new ResultViewData
                {
                    Message = "Дата успешно добавлены",
                    Code = "200"
                };
            }
            catch
            {
                return new ResultViewData
                {
                    Message = "Произошла ошибка при добавлении даты",
                    Code = "500"
                };
            }
        }

        public List<PracticalVisitingMarkViewData> GetPracticalsVisitingData(int subjectId, int groupId)
        {
            var scheduleProtectionPracticals = SubjectManagementService.GetScheduleProtectionPractical(subjectId, groupId);
            var practicalVisitingMarkViewDatas = scheduleProtectionPracticals
                .SelectMany(s => s.ScheduleProtectionPracticalMarks)
                .Select(s => new PracticalVisitingMarkViewData
                {
                    StudentId = s.StudentId,
                    Comment = s.Comment,
                    Mark = s.Mark,
                    PracticalVisitingMarkId = s.Id,
                    ScheduleProtectionPracticalId = s.ScheduleProtectionPracticalId,
                    StudentName = s.Student.FullName,
                    Date = s.ScheduleProtectionPractical.Date.ToShortDateString()
                }).ToList();
            return practicalVisitingMarkViewDatas;
        }

        public ResultViewData SavePracticalsVisitingData(List<StudentsViewData> students)
        {
            try
            {
                foreach (var studentsViewData in students)
                {
                    SubjectManagementService.SavePracticalVisitingData(studentsViewData.PracticalVisitingMark.Select(e => new ScheduleProtectionPracticalMark
                    {
                        Comment = e.Comment,
                        Mark = e.Mark,
                        ScheduleProtectionPracticalId = e.ScheduleProtectionPracticalId,
                        Id = e.PracticalVisitingMarkId,
                        StudentId = e.StudentId
                    }).ToList());
                }

                return new ResultViewData
                {
                    Message = "Данные успешно изменены",
                    Code = "200"
                };
            }
            catch
            {
                return new ResultViewData
                {
                    Message = "Произошла ошибка при изменении данных",
                    Code = "500"
                };
            }
        }
        
        public ResultViewData SaveStudentPracticalsMark(int studentId, int practicalId, string mark, string comment, string date, int id)
        {
            try
            {
                SubjectManagementService.SavePracticalMarks(new List<StudentPracticalMark>
                {
                    new StudentPracticalMark
                    {
                        Mark = mark,
                        PracticalId = practicalId,
                        Id = id,
                        StudentId = studentId
                    }
                });

                return new ResultViewData
                {
                    Message = "Данные успешно изменены",
                    Code = "200"
                };
            }
            catch
            {
                return new ResultViewData
                {
                    Message = "Произошла ошибка при изменении данных",
                    Code = "500"
                };
            }
        }

        public ResultViewData DeleteVisitingDate(int id)
        {
            try
            {
                SubjectManagementService.DeletePracticalsVisitingDate(id);

                return new ResultViewData
                {
                    Message = "Дата успешно удалена",
                    Code = "200"
                };
            }
            catch
            {
                return new ResultViewData
                {
                    Message = "Произошла ошибка при удалении даты",
                    Code = "500"
                };
            }
        }

        public ResultViewData UpdatePracticalsOrder(int subjectId, int prevIndex, int curIndex)
        {
            try
            {
                var isUserAssigned = SubjectManagementService.IsUserAssignedToSubject(UserContext.CurrentUserId, subjectId);
                if (!isUserAssigned)
                {
                    return new ResultViewData
                    {
                        Code = "500",
                        Message = "Пользователь не присоединён к предмету"
                    };
                }
                var practicals = SubjectManagementService.GetSubjectPracticals(subjectId);
                if (prevIndex < curIndex)
                {
                    foreach (var entry in practicals.Skip(prevIndex + 1).Take(curIndex - prevIndex).Append(practicals[prevIndex]).Select((x, index) => new { Value = x, Index = index }))
                    {
                        SubjectManagementService.UpdatePracticalOrder(entry.Value, entry.Index + prevIndex);
                    }
                }
                else
                {
                    foreach (var entry in new List<Practical> { practicals[prevIndex] }.Concat(practicals.Skip(curIndex).Take(prevIndex - curIndex)).Select((x, index) => new { Value = x, Index = index }))
                    {
                        SubjectManagementService.UpdatePracticalOrder(entry.Value, entry.Index + curIndex);
                    }
                }
                return new ResultViewData
                {
                    Code = "200",
                    Message = "Лекции успешно сохранены"
                };
            }
            catch (Exception ex)
            {
                return new ResultViewData
                {
                    Code = "500",
                    Message = ex.Message
                };
            }
        }
    }
}
