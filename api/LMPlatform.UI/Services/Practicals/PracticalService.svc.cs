﻿using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Application.Core;
using Application.Core.Data;
using Application.Core.Helpers;
using Application.Infrastructure.FilesManagement;
using Application.Infrastructure.GroupManagement;
using Application.Infrastructure.KnowledgeTestsManagement;
using Application.Infrastructure.PracticalManagement;
using Application.Infrastructure.SubjectManagement;
using LMPlatform.Models;
using LMPlatform.UI.Attributes;
using LMPlatform.UI.Services.Modules;
using LMPlatform.UI.Services.Modules.CoreModels;
using LMPlatform.UI.Services.Modules.Labs;
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

        private readonly LazyDependency<IFilesManagementService> filesManagementService = new LazyDependency<IFilesManagementService>();

        public IFilesManagementService FilesManagementService => filesManagementService.Value;

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
                var isUserAssigned = SubjectManagementService.IsUserAssignedToSubjectAndLector(UserContext.CurrentUserId, subjectId);
                if (!isUserAssigned)
                {
                    return new ResultViewData
                    {
                        Code = "500",
                        Message = "Пользователь не присоединён к предмету"
                    };
                }
                var normalizedTheme = theme?.Trim();
                if (string.IsNullOrWhiteSpace(normalizedTheme) || normalizedTheme.Length > 256)
                {
                    return new ResultViewData
                    {
                        Code = "500",
                        Message = "Ошибка вылидации"
                    };
                }
                if (duration < 1 || duration > 36)
                {
                    return new ResultViewData
                    {
                        Code = "500",
                        Message = "Ошибка вылидации"
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
                var isUserAssigned = SubjectManagementService.IsUserAssignedToSubjectAndLector(UserContext.CurrentUserId, subjectId);
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

            var group = subject.SubjectGroups.First(x => x.GroupId == groupId);
            var scheduleProtectionPracticalMarksGroup = subject.ScheduleProtectionPracticals.Where(x => x.GroupId == groupId);
            var students = group.SubjectStudents.Select(x => x.Student).Where(x => x.Confirmed.HasValue && x.Confirmed.Value && x.IsActive != false).OrderBy(x => x.LastName);

            var testsResults = TestPassingService.GetSubjectControlTestsResult(subjectId, students.Select(x => x.Id));

            foreach (var student in students)
            {
                var studenTestsPassResults = testsResults.Results.ContainsKey(student.Id) ? testsResults.Results[student.Id] : new List<Models.KnowledgeTesting.TestPassResult>();
                var studentViewData = new StudentsViewData(studenTestsPassResults, student, scheduleProtectionPracticals: scheduleProtectionPracticalMarksGroup, practicals: subject.Practicals);

                marks.Add(new StudentMark
                {
                    FullName = student.FullName,
                    StudentId = student.Id,
                    PracticalsMarkTotal = studentViewData.PracticalMarkTotal,
                    TestMark = studentViewData.TestMark,
                    PracticalVisitingMark = studentViewData.PracticalVisitingMark,
                    PracticalsMarks = studentViewData.StudentPracticalMarks,
                    AllTestsPassed = studenTestsPassResults.Count == testsResults.Tests.Count,
                    TestsPassed = studenTestsPassResults.Count,
                });
            }

            return new StudentsMarksResult
            {
                Students = marks,
                TestsCount = testsResults.Tests.Count,
                Message = "",
                Code = "200"
            };
        }

        public ResultViewData SavePracticalsVisitingData(int dateId, List<string> marks, List<string> comments, List<int> studentsId, List<int> Id, List<StudentsViewData> students, List<bool> showForStudents, int subjectId)
        {
            try
            {
                var isUserAssigned = SubjectManagementService.IsUserAssignedToSubjectAndLector(UserContext.CurrentUserId, subjectId);
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
                    var student = students.FirstOrDefault(x => x.StudentId == currentStudentId);

                    if (student != null && student.PracticalVisitingMark.Any(x => x.ScheduleProtectionPracticalId == dateId))
                    {
                        SubjectManagementService.SavePracticalVisitingData(new ScheduleProtectionPracticalMark(currentId, currentStudentId, currentComment, currentMark, dateId, showForStudent));

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
                var isUserAssigned = SubjectManagementService.IsUserAssignedToSubjectAndLector(UserContext.CurrentUserId, subjectId);
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
                var isUserAssigned = SubjectManagementService.IsUserAssignedToSubjectAndLector(UserContext.CurrentUserId, subjectId);
                if (!isUserAssigned)
                {
                    return new ResultViewData
                    {
                        Code = "500",
                        Message = "Пользователь не присоединён к предмету"
                    };
                }
                PracticalManagementService.UpdatePracticalsOrder(subjectId, prevIndex, curIndex);

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
                var subjectOwner = SubjectManagementService.GetSubjectOwner(subjectId);
                var groupProtectionSchedule = GroupManagementService.GetGroup(
                    new Query<Group>(e => e.Id == groupId)
                    .Include(x => x.ScheduleProtectionPracticals.Select(x => x.Lecturer.User))
                    ).ScheduleProtectionPracticals.ToList();

                var practicalsViewData = practicals.Select(e => new PracticalsViewData(e) {
                    ScheduleProtectionPracticalsRecommended = groupProtectionSchedule?.Select(x => new ScheduleProtectionLesson
                    {
                        ScheduleProtectionId = x.Id,
                        Mark = string.Empty
                    })?.ToList()
                }).ToList();
                var durationCount = 0;

                foreach (var practical in practicalsViewData)
                {
                    var mark = 10;
                    durationCount += practical.Duration;
                    for (int i = 0; i < practical.ScheduleProtectionPracticalsRecommended.Count; i++)
                    {
                        if (i >= durationCount - practical.Duration)
                        {
                            practical.ScheduleProtectionPracticalsRecommended[i].Mark = mark.ToString(CultureInfo.InvariantCulture);

                            if (mark != 1)
                            {
                                mark -= 1;
                            }
                        }
                    }
                }

                return new PracticalsResult
                {
                    Practicals = practicalsViewData.ToList(),
                    ScheduleProtectionPracticals = groupProtectionSchedule.Select(e =>
                    {
                        if (e.Lecturer == null)
                        {
                            e.Lecturer = subjectOwner;
                        }
                        return new ScheduleProtectionPracticalViewData(e);
                    }).ToList(),
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

        public ResultViewData SaveStudentPracticalMark(int studentId, int practicalId, string mark, string comment, string date, int id, bool showForStudent, int subjectId)
        {
            try
            {
                var isUserAssigned = SubjectManagementService.IsUserAssignedToSubjectAndLector(UserContext.CurrentUserId, subjectId);
                if (!isUserAssigned)
                {
                    return new ResultViewData
                    {
                        Code = "500",
                        Message = "Пользователь не присоединён к предмету"
                    };
                }
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

        public UserLabFilesResult GetUserPracticalFiles(int userId, int subjectId)
        {
            try
            {
                var labFiles = PracticalManagementService.GetUserPracticalFiles(userId, subjectId);
                var model = labFiles
                    .GroupBy(x => x.Lab?.Order)
                    .OrderBy(x => x.Key)
                    .SelectMany(x => x.OrderBy(x => x.Date))
                    .Select(e => new UserLabFileViewData
                    {
                        PracticalShortName = e.Practical?.ShortName,
                        PracticalTheme = e.Lab?.Theme,
                        Order = e.Practical?.Order,
                        Comments = e.Comments,
                        Id = e.Id,
                        PathFile = e.Attachments,
                        IsReceived = e.IsReceived,
                        IsReturned = e.IsReturned,
                        PracticalId = e.PracticalId,
                        UserId = e.UserId,
                        Date = e.Date != null ? e.Date.Value.ToString("dd.MM.yyyy HH:mm") : string.Empty,
                        Attachments = FilesManagementService.GetAttachments(e.Attachments).ToList()
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

        public HasGroupsJobProtectionViewData HasSubjectPracticalsJobProtection(int subjectId, bool isActive)
        {
            var groups = SubjectManagementService.GetSubjectGroups(new Query<SubjectGroup>(x => x.SubjectId == subjectId && x.IsActiveOnCurrentGroup == isActive));
            return new HasGroupsJobProtectionViewData
            {
                HasGroupsJobProtection = groups.Select(x => new HasGroupJobProtectionViewData
                {
                    GroupId = x.GroupId,
                    HasJobProtection = PracticalManagementService.HasSubjectProtection(x.GroupId, subjectId)
                })
            };
        }

        public GroupJobProtectionViewData GetGroupJobProtection(int subjectId, int groupId)
        {
            var group = SubjectManagementService.GetSubjectGroup(new Query<SubjectGroup>(x => x.GroupId == groupId && x.SubjectId == subjectId)
                .Include(x => x.SubjectStudents.Select(x => x.Student))
                .Include(x => x.SubjectStudents.Select(x => x.SubGroup)));

            var studentJobProtection = new List<StudentJobProtectionViewData>();
            var studentsLabFiles = PracticalManagementService.GetGroupPracticalFiles(subjectId, groupId);

            foreach (var subjectStudent in group.SubjectStudents.Where(e => e.Student.Confirmed.HasValue && e.Student.Confirmed.Value).OrderBy(e => e.Student.FullName))
            {
                studentJobProtection.Add(new StudentJobProtectionViewData
                {
                    StudentId = subjectStudent.StudentId,
                    StudentName = subjectStudent.Student.FullName,
                    GroupId = groupId,
                    HasProtection = studentsLabFiles.Any(x => x.UserId == subjectStudent.StudentId && !x.IsReceived && !x.IsReturned && !x.IsCoursProject)
                });
            }
            return new GroupJobProtectionViewData
            {
                StudentsJobProtections = studentJobProtection
            };
        }

        public StudentJobProtectionViewData GetStudentJobProtection(int subjectId, int groupId, int studentId)
        {
            var group = SubjectManagementService.GetSubjectGroup(new Query<SubjectGroup>(x => x.GroupId == groupId && x.SubjectId == subjectId)
                .Include(x => x.SubjectStudents.Select(x => x.Student))
                .Include(x => x.SubjectStudents.Select(x => x.SubGroup)));

            var subjectStudent = group.SubjectStudents.FirstOrDefault(x => x.Student.Confirmed.HasValue && x.Student.Confirmed.Value && x.StudentId == studentId);

            if (subjectStudent == null)
            {
                return new StudentJobProtectionViewData
                {
                    Code = "500"
                };
            }

            var studentsLabFiles = PracticalManagementService.GetStudentLabFiles(subjectId, studentId);

            return new StudentJobProtectionViewData
            {
                StudentId = studentId,
                StudentName = subjectStudent.Student.FullName,
                GroupId = groupId,
                HasProtection = studentsLabFiles.Any(x =>
                    x.UserId == studentId && !x.IsReceived && !x.IsReturned && !x.IsCoursProject)
            };
        }
    }
}
