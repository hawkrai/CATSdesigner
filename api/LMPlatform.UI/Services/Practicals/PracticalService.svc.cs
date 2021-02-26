using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Application.Core;
using Application.Core.Data;
using Application.Core.Helpers;
using Application.Infrastructure.GroupManagement;
using Application.Infrastructure.KnowledgeTestsManagement;
using Application.Infrastructure.PracticalManagement;
using Application.Infrastructure.SubjectManagement;
using LMPlatform.Models;
using LMPlatform.UI.Attributes;
using LMPlatform.UI.Services.Modules;
using LMPlatform.UI.Services.Modules.CoreModels;
using LMPlatform.UI.Services.Modules.Practicals;
using LMPlatform.UI.Services.Modules.Schedule;
using Newtonsoft.Json;
using WebMatrix.WebData;

namespace LMPlatform.UI.Services.Practicals
{
    [JwtAuth]
    public class PracticalService : IPracticalService
    {
        private readonly LazyDependency<IPracticalManagementService> practicalManagementService = new LazyDependency<IPracticalManagementService>();

        public IPracticalManagementService PracticalManagementService => practicalManagementService.Value;

        private readonly LazyDependency<ISubjectManagementService> subjectManagementService = new LazyDependency<ISubjectManagementService>();

        public ISubjectManagementService SubjectManagementService => subjectManagementService.Value;


        private readonly LazyDependency<ITestsManagementService> testsMaangementService = new LazyDependency<ITestsManagementService>();

        public ITestsManagementService TestsManagementService => testsMaangementService.Value;


        private readonly LazyDependency<IGroupManagementService> groupManagementService = new LazyDependency<IGroupManagementService>();

        public IGroupManagementService GroupManagementService => groupManagementService.Value;


        private readonly LazyDependency<ITestPassingService> testPassingService = new LazyDependency<ITestPassingService>();

        public ITestPassingService TestPassingService => testPassingService.Value;

        private const int PracticalModuleId = 13;

        public PracticalsResult GetPracticals(string subjectId)
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
                PracticalManagementService.SavePractical(new Practical
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
                PracticalManagementService.DeletePracticals(id);
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

        public StudentsMarksResult GetMarks(int subjectId, int groupId)
        {
            var subject = SubjectManagementService.GetSubject(
                new Query<Subject>(x => x.Id == subjectId)
                .Include(x => x.Practicals)
                .Include(x => x.ScheduleProtectionPracticals)
                .Include(x => x.SubjectGroups.Select(g => g.SubjectStudents))
                .Include(x => x.SubjectGroups.Select(g => g.SubjectStudents.Select(s => s.Student.ScheduleProtectionPracticalMarks)))
                .Include(x => x.SubjectGroups.Select(g => g.SubjectStudents.Select(s => s.Student.StudentPracticalMarks))));

            var marks = new List<StudentMark>();

            var controlTests = TestsManagementService.GetTestsForSubject(subjectId).Where(x => !x.ForSelfStudy && !x.BeforeEUMK && !x.ForEUMK && !x.ForNN);

            var group = subject.SubjectGroups.First(x => x.GroupId == groupId);

            foreach (var student in group.SubjectStudents.Select(x => x.Student).OrderBy(x => x.LastName))
            {
                var studentViewData = new StudentsViewData(TestPassingService.GetStidentResults(subjectId, student.Id).Where(x => controlTests.Any(y => y.Id == x.TestId)).ToList(), student, scheduleProtectionPracticals: subject.ScheduleProtectionPracticals, practicals: subject.Practicals);

                marks.Add(new StudentMark
                {
                    FullName = student.FullName,
                    StudentId = student.Id,
                    PracticalsMarkTotal = studentViewData.PracticalMarkTotal,
                    TestMark = studentViewData.TestMark,
                    PracticalVisitingMark = studentViewData.PracticalVisitingMark,
                    PracticalsMarks = studentViewData.StudentPracticalMarks,
                    AllTestsPassed = studentViewData.AllTestsPassed
                });
            }

            return new StudentsMarksResult
            {
                Students = marks,
                Message = "",
                Code = "200"
            };
        }

        public ResultViewData SavePracticalsVisitingData(int dateId, List<string> marks, List<string> comments, List<int> studentsId, List<int> Id, List<StudentsViewData> students, List<bool> showForStudents, int subjectId)
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
                var count = studentsId.Count;

                for (var i = 0; i < count; i++)
                {
                    var currentMark = marks[i];
                    var currentComment = comments[i];
                    var currentStudentId = studentsId[i];
                    var currentId = Id[i];
                    var showForStudent = showForStudents[i];

                    foreach (var student in students)
                    {
                        if (student.StudentId == currentStudentId)
                        {
                            foreach (var practicalVisiting in student.PracticalVisitingMark)
                            {
                                if (practicalVisiting.ScheduleProtectionPracticalId == dateId)
                                {
                                    SubjectManagementService.SavePracticalVisitingData(new ScheduleProtectionPracticalMark(currentId, currentStudentId, currentComment, currentMark, dateId, showForStudent));
                                }
                            }
                        }

                    }
                }

                return new ResultViewData
                {
                    Message = "Данные успешно добавлены",
                    Code = "200"
                };
            }
            catch
            {
                return new ResultViewData
                {
                    Message = "Произошла ошибка при добавлении данных",
                    Code = "500"
                };
            }
        }
        
        public ResultViewData SaveStudentPracticalsMark(int studentId, int practicalId, string mark, string comment, string date, int id, int subjectId)
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
                PracticalManagementService.SavePracticalMarks(new List<StudentPracticalMark>
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
                var practicals = PracticalManagementService.GetSubjectPracticals(subjectId);
                if (prevIndex < curIndex)
                {
                    foreach (var entry in practicals.Skip(prevIndex + 1).Take(curIndex - prevIndex).Append(practicals[prevIndex]).Select((x, index) => new { Value = x, Index = index }))
                    {
                        PracticalManagementService.UpdatePracticalOrder(entry.Value, entry.Index + prevIndex);
                    }
                }
                else
                {
                    foreach (var entry in new List<Practical> { practicals[prevIndex] }.Concat(practicals.Skip(curIndex).Take(prevIndex - curIndex)).Select((x, index) => new { Value = x, Index = index }))
                    {
                        PracticalManagementService.UpdatePracticalOrder(entry.Value, entry.Index + curIndex);
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

        public PracticalsResult GetPracticalsV2(int subjectId, int groupId)
        {
            try
            {
                var practicals = PracticalManagementService.GetPracticals(new Query<Practical>(e => e.SubjectId == subjectId)).OrderBy(e => e.Order).ToList();
                var groupProtectionSchedule = GroupManagementService.GetGroup(
                    new Query<Group>(e => e.Id == groupId)
                    .Include(x => x.ScheduleProtectionPracticals)
                    ).ScheduleProtectionPracticals.ToList();

                var practicalsViewData = practicals.Select(e => new PracticalsViewData(e) {
                    ScheduleProtectionPracticalsRecommended = groupProtectionSchedule?.Select(x => new ScheduleProtectionLesson
                    {
                        ScheduleProtectionId = x.Id,
                        Mark = string.Empty
                    })?.ToList() ?? new List<ScheduleProtectionLesson>()
                }).ToList();
                var durationCount = 0;

                foreach (var practical in practicalsViewData)
                {
                    var mark = 10;
                    durationCount += practical.Duration / 2;
                    for (int i = 0; i < practical.ScheduleProtectionPracticalsRecommended.Count; i++)
                    {
                        if (i + 1 > durationCount - (practical.Duration / 2))
                        {
                            practical.ScheduleProtectionPracticalsRecommended[i].Mark = mark.ToString(CultureInfo.InvariantCulture);

                            if (i + 1 >= durationCount)
                            {
                                if (mark != 1)
                                {
                                    mark -= 1;
                                }
                            }
                        }
                    }
                }

                return new PracticalsResult
                {
                    Practicals = practicalsViewData.ToList(),
                    ScheduleProtectionPracticals = groupProtectionSchedule.Select(e => new ScheduleProtectionPracticalViewData(e)).ToList(),
                    Message = "Практические работы успешно загружены",
                    Code = "200"
                };
            }
            catch (Exception ex)
            {
                return new PracticalsResult
                {
                    Message = "Произошла ошибка при получении практических работ",
                    Code = "500"
                };
            }
        }

        public ResultViewData SaveStudentLabsMark(int studentId, int practicalId, string mark, string comment, string date, int id, bool showForStudent)
        {
            try
            {
                PracticalManagementService.SaveStudentPracticalMark(new StudentPracticalMark(practicalId, studentId, UserContext.CurrentUserId, mark, comment, date, id, showForStudent));

                return new ResultViewData
                {
                    Message = "Данные успешно добавлены",
                    Code = "200"
                };
            }
            catch (Exception ex)
            {
                return new ResultViewData
                {
                    Message = "Произошла ошибка при добавлении данных",
                    Code = "500"
                };
            }
        }
    }
}
