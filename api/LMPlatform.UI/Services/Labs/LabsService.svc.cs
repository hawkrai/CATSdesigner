using System;
using System.Collections.Generic;
using System.Linq;
using Application.Core;
using Application.Infrastructure.FilesManagement;
using Application.Infrastructure.SubjectManagement;
using LMPlatform.Models;
using LMPlatform.UI.Services.Modules;
using LMPlatform.UI.Services.Modules.Labs;
using Application.Infrastructure.GroupManagement;
using Application.Infrastructure.KnowledgeTestsManagement;
using System.Globalization;
using Application.Core.Data;
using Application.Core.Helpers;
using Application.Infrastructure.StudentManagement;
using LMPlatform.UI.Attributes;
using LMPlatform.UI.Services.Modules.CoreModels;
using Application.Infrastructure.LabsManagement;
using LMPlatform.UI.Services.Modules.Schedule;
using Newtonsoft.Json;
using LMPlatform.UI.Services.Modules.Practicals;

namespace LMPlatform.UI.Services.Labs
{
    [JwtAuth]
    public class LabsService : ILabsService
    {
        private readonly LazyDependency<ITestPassingService> testPassingService = new LazyDependency<ITestPassingService>();

        public ITestPassingService TestPassingService => testPassingService.Value;

        private readonly LazyDependency<IGroupManagementService> groupManagementService = new LazyDependency<IGroupManagementService>();

        public IGroupManagementService GroupManagementService => groupManagementService.Value;

        private readonly LazyDependency<ISubjectManagementService> subjectManagementService = new LazyDependency<ISubjectManagementService>();

        public ISubjectManagementService SubjectManagementService => subjectManagementService.Value;

        private readonly LazyDependency<IFilesManagementService> filesManagementService = new LazyDependency<IFilesManagementService>();

        public IFilesManagementService FilesManagementService => filesManagementService.Value;

        private readonly LazyDependency<ITestsManagementService> testsManagementService = new LazyDependency<ITestsManagementService>();

        public ITestsManagementService TestsManagementService => testsManagementService.Value;

        private readonly LazyDependency<ILabsManagementService> labsManagementService = new LazyDependency<ILabsManagementService>();

        public ILabsManagementService LabsManagementService => labsManagementService.Value;

        public LabsResult GetLabs(string subjectId)
        {
            try
            {
                var subId = int.Parse(subjectId);
                var query = new Query<Subject>(s => s.Id == subId)
                    .Include(s => s.Labs);
                var model = SubjectManagementService.GetSubject(query).Labs
                    .OrderBy(e => e.Order)
                    .Select(e => new LabsViewData(e)).ToList();
                return new LabsResult
                {
                    Labs = model,
                    Message = "text.labs.get.response.success",
                    Code = "200"
                };
            }
            catch
            {
                return new LabsResult
                {
                    Message = "text.labs.get.response.failure.unknown",
                    Code = "500"
                };
            }
        }

        public StudentsMarksResult GetMarks(int subjectId, int groupId)
        {
            try
            {
                var group = this.GroupManagementService.GetGroups(
                    new Query<Group>(e => e.SubjectGroups.Any(x => x.SubjectId == subjectId && x.GroupId == groupId))
                        .Include(e => e.Students.Select(x => x.StudentLabMarks))
                        .Include(e => e.Students.Select(x => x.User))).ToList()[0];

                var labsData = this.SubjectManagementService.GetSubject(subjectId).Labs.OrderBy(e => e.Order).ToList();

                var students = new List<StudentsViewData>();

                var controlTests = TestsManagementService.GetTestsForSubject(subjectId, lite: true).Where(x => !x.ForSelfStudy);

                foreach (var student in group.Students)
                {
                    students.Add(new StudentsViewData(this.TestPassingService.GetStidentResults(subjectId, student.Id).Where(x => controlTests.Any(y => y.Id == x.TestId)).ToList(), student, labs: labsData));
                }

                return new StudentsMarksResult
                {
                    Students = students.Select(e => new StudentMark
                    {
                        FullName = e.FullName,
                        StudentId = e.StudentId,
                        LabsMarkTotal = e.LabsMarkTotal,
                        TestMark = e.TestMark,
                        LabsMarks = e.StudentLabMarks
                    }).ToList(),
                    Message = "",
                    Code = "200"
                };
            }
            catch
            {
                return new StudentsMarksResult
                {
                    Message = "text.results.get.response.failure.unknown",
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
                        Message = "text.lab.save.response.failure.unattachedStudent"
                    };
                }
                var attachmentsModel = JsonConvert.DeserializeObject<List<Attachment>>(attachments).ToList();
                var normalizedTheme = theme?.Trim();

                if (string.IsNullOrWhiteSpace(normalizedTheme) || normalizedTheme.Length > 256)
                {
                    return new ResultViewData
                    {
                        Code = "500",
                        Message = "text.lab.save.response.failure.validation"
                    };
                }
                else if (duration < 1 || duration > 36)
                {
                    return new ResultViewData
                    {
                        Code = "500",
                        Message = "text.lab.save.response.failure.validation"
                    };
                }
                SubjectManagementService.SaveLabs(new Models.Labs
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
                    Message = "text.lab.save.response.success",
                    Code = "200"
                };
            }
            catch
            {
                return new ResultViewData
                {
                    Message = "text.lab.save.response.failure.unknown",
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
                        Message = "text.lab.save.response.failure.unattachedStudent"
                    };
                }
                SubjectManagementService.DeleteLabs(id);
                return new ResultViewData
                {
                    Message = "text.lab.delete.response.success",
                    Code = "200"
                };
            }
            catch (Exception e)
            {
                return new ResultViewData
                {
                    Message = "text.lab.delete.response.failure.unknown" + e.Message,
                    Code = "500"
                };
            }
        }

        public ResultViewData SaveLabsVisitingDataSingle(int dateId, string mark, string comment, int studentsId, int id, bool showForStudent)
        {
            try
            {
                SubjectManagementService.SaveLabsVisitingData(new ScheduleProtectionLabMark(id, studentsId, comment, mark, dateId, showForStudent));

                return new ResultViewData
                {
                    Message = "text.data.add.response.success",
                    Code = "200"
                };
            }
            catch
            {
                return new ResultViewData
                {
                    Message = "text.data.add.response.failure.unknown",
                    Code = "500"
                };
            }
        }

        public ResultViewData SaveLabsVisitingData(int dateId, List<string> marks, List<string> comments, List<int> studentsId, List<int> Id, List<StudentsViewData> students, List<bool> showForStudents)
        {
            try
            {
                var count = studentsId.Count;

                for (var i = 0; i < count; i++)
                {
                    var currentMark = marks[i];
                    var currentComment = comments[i];
                    var currentStudentId = studentsId[i];
                    var currentId = Id[i];
                    var showForStudent = showForStudents[i];
                    var student = students.FirstOrDefault(x => x.StudentId == currentStudentId);
                    if (student != null && student.LabVisitingMark.Any(x => x.ScheduleProtectionLabId == dateId))
                    {
                        SubjectManagementService.SaveLabsVisitingData(new ScheduleProtectionLabMark(currentId, currentStudentId, currentComment, currentMark, dateId, showForStudent));

                    }
                }

                return new ResultViewData
                {
                    Message = "text.data.add.response.success",
                    Code = "200"
                };
            }
            catch
            {
                return new ResultViewData
                {
                    Message = "text.data.add.response.failure.unknown",
                    Code = "500"
                };
            }
        }


        public ResultViewData SaveStudentLabsMark(int studentId, int labId, string mark, string comment, string date, int id, bool showForStudent)
        {
            try
            {
                SubjectManagementService.SaveStudentLabsMark(new StudentLabMark(labId, studentId, UserContext.CurrentUserId, mark, comment, date, id, showForStudent));
                return new ResultViewData
                {
                    Message = "text.data.add.response.success",
                    Code = "200"
                };
            }
            catch
            {
                return new ResultViewData
                {
                    Message = "text.data.add.response.failure.unknown",
                    Code = "500"
                };
            }
        }

        public ResultViewData RemoveStudentLabsMark(int id)
        {
            try
            {
                SubjectManagementService.RemoveStudentLabsMark(id);
                return new ResultViewData
                {
                    Message = "text.data.delete.response.success",
                    Code = "200"
                };
            } catch
            {
                return new ResultViewData
                {
                    Message = "text.data.delete.response.failure.unknown",
                    Code = "500"
                };
            }
        }
        public UserLabFilesResult GetUserLabFiles(int userId, int subjectId)
        {
            try
            {
                var currentUserId = UserContext.CurrentUserId;
                var isStudent = UserContext.Role == "student";

                if (isStudent)
                {
                    userId = currentUserId;
                }

                var labFiles = LabsManagementService.GetUserLabFiles(userId, subjectId);
                var model = labFiles
                    .GroupBy(x => x.Lab?.Order)
                    .OrderBy(x => x.Key)
                    .SelectMany(x => x.OrderBy(x => x.Date))
                    .Select(e => {
                        var attachments = FilesManagementService.GetAttachments(e.Attachments).ToList();
                        var firstAttachment = attachments.FirstOrDefault();
                        long? fileSizeBytes = firstAttachment != null ? FilesManagementService.GetFileSize(firstAttachment) : null;
                        double? fileSizeKb = fileSizeBytes.HasValue ? Math.Round(fileSizeBytes.Value / 1024.0, 2) : (double?)null;

                        return new UserLabFileViewData
                        {
                            LabShortName = e.Lab?.ShortName,
                            LabTheme = e.Lab?.Theme,
                            Order = e.Lab?.Order,
                            Comments = e.Comments,
                            Id = e.Id,
                            PathFile = e.Attachments,
                            IsReceived = e.IsReceived,
                            IsReturned = e.IsReturned,
                            LabId = e.LabId,
                            UserId = e.UserId,
                            fileSize = fileSizeKb.HasValue ? $"{fileSizeKb} КБ" : string.Empty,
                            Date = e.Date != null ? e.Date.Value.ToString("dd.MM.yyyy HH:mm") : string.Empty,
                            Attachments = attachments
                        };
                    }).ToList();

                return new UserLabFilesResult
                {
                    UserLabFiles = model,
                    Message = "text.data.get.response.success",
                    Code = "200"
                };
            }
            catch
            {
                return new UserLabFilesResult
                {
                    Message = "text.data.get.response.failure.unknown",
                    Code = "500"
                };
            }
        }



        public StudentsMarksResult GetMarksV2(int subjectId, int groupId)
        {
            try
            {
                var group = this.GroupManagementService.GetGroups(new Query<Group>(e => e.SubjectGroups.Any(x => x.SubjectId == subjectId && x.GroupId == groupId))
                    .Include(e => e.Students.Select(x => x.StudentLabMarks))
                    .Include(e => e.Students.Select(x => x.ScheduleProtectionLabMarks))
                    .Include(e => e.Students.Select(x => x.User))).ToList()[0];

                IList<SubGroup> subGroups = this.SubjectManagementService.GetSubGroupsV2(subjectId, group.Id);

                IList<SubGroup> subGroupsWithSchedule = this.SubjectManagementService.GetSubGroupsV2WithScheduleProtectionLabs(subjectId, group.Id).ToList();

                var labsData = this.SubjectManagementService.GetSubject(subjectId).Labs.OrderBy(e => e.Order).ToList();

                var students = new List<StudentsViewData>();

                var controlTests = TestsManagementService.GetTestsForSubject(subjectId).Where(x => !x.ForSelfStudy && !x.BeforeEUMK && !x.ForEUMK && !x.ForNN);


                foreach (var student in group.Students.Where(e => e.Confirmed.HasValue && e.Confirmed.Value).OrderBy(e => e.LastName))
                {
                    var scheduleProtectionLabs = subGroups.Any()
                                                     ? subGroups.FirstOrDefault(x => x.Name == "first").SubjectStudents.Any(x => x.StudentId == student.Id)
                                                           ? subGroupsWithSchedule.FirstOrDefault(x => x.Name == "first").ScheduleProtectionLabs.OrderBy(
                                                               x => x.Date).ToList()
                                                           : subGroups.FirstOrDefault(x => x.Name == "second").SubjectStudents.Any(x => x.StudentId == student.Id)
                                                                 ? subGroupsWithSchedule.FirstOrDefault(x => x.Name == "second").ScheduleProtectionLabs.OrderBy(
                                                                     x => x.Date).ToList()
                                                                 : subGroups.FirstOrDefault(x => x.Name == "third").SubjectStudents.Any(x => x.StudentId == student.Id)
                                                                    ? subGroupsWithSchedule.FirstOrDefault(x => x.Name == "third").ScheduleProtectionLabs.OrderBy(
                                                                        x => x.Date).ToList()
                                                                        : new List<ScheduleProtectionLabs>()
                                                     : new List<ScheduleProtectionLabs>();
                    students.Add(new StudentsViewData(this.TestPassingService.GetStidentResults(subjectId, student.Id).Where(x => controlTests.Any(y => y.Id == x.TestId)).ToList(), student, scheduleProtectionLabs: scheduleProtectionLabs, labs: labsData));
                }

                return new StudentsMarksResult
                {
                    Students = students.Select(e => new StudentMark
                    {
                        FullName = e.FullName,
                        Login = e.Login,
                        SubGroup = subGroups
                            .FirstOrDefault(x => x.Name == "first").SubjectStudents
                            .Any(x => x.StudentId == e.StudentId) ? 1 : subGroups
                            .FirstOrDefault(x => x.Name == "second").SubjectStudents
                            .Any(x => x.StudentId == e.StudentId) ? 2 : subGroups
                            .FirstOrDefault(x => x.Name == "third").SubjectStudents
                            .Any(x => x.StudentId == e.StudentId) ? 3 : 4,
                        StudentId = e.StudentId,
                        LabsMarkTotal = e.LabsMarkTotal,
                        TestMark = e.TestMark,
                        LabVisitingMark = e.LabVisitingMark,
                        LabsMarks = e.StudentLabMarks,
                    }).ToList(),
                    Message = "",
                    Code = "200"
                };
            }
            catch(Exception ex)
            {
                return new StudentsMarksResult
                {
                    Message = $"Произошла ошибка при получении результатов студентов - {ex.Message} - {ex.InnerException}",
                    Code = "500"
                };
            }
        }

        public StudentsMarksResult GetMarksV3(int subjectId, int groupId)
        {
            var subject = SubjectManagementService.GetSubject(
                new Query<Subject>(x => x.Id == subjectId)
                .Include(x => x.Labs)
                .Include(x => x.SubjectGroups.Select(g => g.SubGroups.Select(sg => sg.ScheduleProtectionLabs)))
                .Include(x => x.SubjectGroups.Select(g => g.SubGroups.Select(sg => sg.SubjectStudents)))
                .Include(x => x.SubjectGroups.Select(g => g.SubjectStudents.Select(s => s.Student.ScheduleProtectionLabMarks)))
                .Include(x => x.SubjectGroups.Select(g => g.SubjectStudents.Select(s => s.Student.StudentLabMarks))));

            var marks = new List<StudentMark>();

            var group = subject.SubjectGroups.First(x => x.GroupId == groupId);

            var students = group.SubjectStudents.Select(x => x.Student).Where(e => e.Confirmed.HasValue && e.Confirmed.Value && e.IsActive != false && e.GroupId == groupId).OrderBy(x => x.LastName);

            var testsResults = TestPassingService.GetSubjectControlTestsResult(subjectId, students.Select(x => x.Id));

            foreach (var student in students)
            {
                var subGroup = group.SubGroups.FirstOrDefault(x => x.SubjectStudents.Any(x => x.StudentId == student.Id));
                var studenTestsPassResults = testsResults.Results.ContainsKey(student.Id) ? testsResults.Results[student.Id] : new List<Models.KnowledgeTesting.TestPassResult>();
                var studentViewData = new StudentsViewData(studenTestsPassResults, student, scheduleProtectionLabs: subGroup.ScheduleProtectionLabs, labs: subject.Labs);

                marks.Add(new StudentMark
                {
                    FullName = student.FullName,
                    SubGroup = subGroup.Name == "first" ? 1 : subGroup.Name == "second" ? 2 : subGroup.Name == "third" ? 3 : 4,
                    StudentId = student.Id,
                    LabsMarkTotal = studentViewData.LabsMarkTotal,
                    TestMark = studentViewData.TestMark,
                    LabVisitingMark = studentViewData.LabVisitingMark,
                    LabsMarks = studentViewData.StudentLabMarks,
                    AllTestsPassed = studenTestsPassResults.Count == testsResults.Tests.Count,
                    TestsPassed = studenTestsPassResults.Count
                });
            }

            var currentUserId = UserContext.CurrentUserId;
            var isStudent = UserContext.Role == "student";

            if (isStudent)
            {
                foreach (var mark in marks)
                {
                    var isCurrentStudent = mark.StudentId == currentUserId;

                    foreach (var vm in mark.LabVisitingMark)
                    {
                        if (!isCurrentStudent || vm.ShowForStudent != true)
                        {
                            vm.Comment = string.Empty;
                        }
                    }

                    foreach (var lm in mark.LabsMarks)
                    {
                        if (!isCurrentStudent || lm.ShowForStudent != true)
                        {
                            lm.Comment = string.Empty;
                        }
                    }
                }
            }

            return new StudentsMarksResult
            {
                Students = marks,
                TestsCount = testsResults.Tests.Count,
                Message = "",
                Code = "200"
            };
        }

        public LabsResult GetLabsV2(int subjectId, int groupId)
        {

            try
            {
                var labs = this.SubjectManagementService.GetLabsV2(subjectId).OrderBy(e => e.Order);
                var subjectOwner = SubjectManagementService.GetSubjectOwner(subjectId);
                var subGroups = this.SubjectManagementService.GetSubGroupsV2WithScheduleProtectionLabs(subjectId, groupId);
                var labsSubGroups = new List<LabsViewData>();
                var scheduleProtectionLabs = new List<ScheduleProtectionLabsViewData>();
                foreach (var subGroup in subGroups)
                {
                    var subGroupValue = subGroup.Name == "first" ? 1 : subGroup.Name == "second" ? 2 : 3;
                    var labsSubGroup = labs.Select(e => new LabsViewData
                    {
                        Theme = e.Theme,
                        Order = e.Order,
                        Duration = e.Duration,
                        ShortName = e.ShortName.Substring(0),
                        LabId = e.Id,
                        SubjectId = e.SubjectId,
                        SubGroup = subGroupValue,
                        ScheduleProtectionLabsRecommended = subGroup.ScheduleProtectionLabs
                            .OrderBy(x => x.Date)
                            .Select(x => new ScheduleProtectionLesson
                            {
                                ScheduleProtectionId = x.Id,
                                Mark = String.Empty
                            }).ToList()
                    }).ToList();

                    var durationCount = 0;
                    foreach (var lab in labsSubGroup)
                    {
                        var mark = 10;
                        var maxMarkDays = lab.Duration / 2 + lab.Duration % 2;
                        if (durationCount % 2 > lab.Duration % 2) maxMarkDays++;

                        for (int i = 0; i < lab.ScheduleProtectionLabsRecommended.Count; i++)
                        {
                            if ((i + 1) * 2 > durationCount)
                            {
                                lab.ScheduleProtectionLabsRecommended[i].Mark = mark.ToString(CultureInfo.InvariantCulture);
                                maxMarkDays--;
                                if (mark != 1 && maxMarkDays <= 0)
                                {
                                    mark -= 1;
                                }
                            }
                        }
                        durationCount += lab.Duration;
                    }

                    labsSubGroups.AddRange(labsSubGroup);

                    var scheduleProtactionLabsSubGroup = subGroup.ScheduleProtectionLabs
                        .OrderBy(e => e.Date)
                        .Select(
                    e =>
                    {
                        if (e.Lecturer == null)
                        {
                            e.Lecturer = subjectOwner;
                        }
                        return new ScheduleProtectionLabsViewData(e);
                    }).ToList();
                    scheduleProtactionLabsSubGroup.ForEach(e => e.SubGroup = subGroupValue);
                    scheduleProtectionLabs.AddRange(scheduleProtactionLabsSubGroup);
                }

                return new LabsResult
                {
                    Labs = labsSubGroups,
                    ScheduleProtectionLabs = scheduleProtectionLabs,
                    Message = "text.labs.get.response.success",
                    Code = "200",
                    SubGroups = subGroups.Select(x => new SubGroupViewData(x)).ToList()
                };
            }
            catch
            {
                return new LabsResult
                {
                    Message = "text.labs.get.response.failure.unknown",
                    Code = "500"
                };
            }
        }
        public ResultViewData UpdateLabsOrder(int subjectId, int prevIndex, int curIndex)
        {
            try
            {
                SubjectManagementService.UpdateLabsOrder(subjectId, prevIndex, curIndex);
                return new ResultViewData
                {
                    Code = "200",
                    Message = "text.labs.save.response.success"
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

        public HasGroupsJobProtectionViewData HasSubjectLabsJobProtection(int subjectId, bool isActive)
        {
            var groups = SubjectManagementService.GetSubjectGroups(new Query<SubjectGroup>(x => x.SubjectId == subjectId && x.IsActiveOnCurrentGroup == isActive));
            return new HasGroupsJobProtectionViewData
            {
                HasGroupsJobProtection = groups.Select(x => new HasGroupJobProtectionViewData
                {
                    GroupId = x.GroupId,
                    HasJobProtection = LabsManagementService.HasSubjectProtection(x.GroupId, subjectId)
                })
            };
        }



        private int GetSubGroupNumber(SubGroup subGroup)
        {
            return subGroup.Name == "first" ? 1 : subGroup.Name == "second" ? 2 : subGroup.Name == "third" ? 3 : 0;
        }

        public GroupJobProtectionViewData GetGroupJobProtection(int subjectId, int groupId)
        {
            var group = SubjectManagementService.GetSubjectGroup(new Query<SubjectGroup>(x => x.GroupId == groupId && x.SubjectId == subjectId)
                    .Include(x => x.SubjectStudents.Select(x => x.Student))
                    .Include(x => x.SubjectStudents.Select(x => x.SubGroup)));

            var studentJobProtection = new List<StudentJobProtectionViewData>();
            var studentsLabFiles = LabsManagementService.GetGroupLabFiles(subjectId, groupId);

            foreach (var subjectStudent in group.SubjectStudents.Where(e => e.Student.Confirmed.HasValue && e.Student.Confirmed.Value && e.Student.IsActive != false).OrderBy(e => e.Student.FullName))
            {
                studentJobProtection.Add(new StudentJobProtectionViewData
                {
                    StudentId = subjectStudent.StudentId,
                    StudentName = subjectStudent.Student.FullName,
                    SubGroup = GetSubGroupNumber(subjectStudent.SubGroup),
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

            var studentsLabFiles = LabsManagementService.GetStudentLabFiles(subjectId, studentId);

            return new StudentJobProtectionViewData
            {
                StudentId = studentId,
                StudentName = subjectStudent.Student.FullName,
                SubGroup = GetSubGroupNumber(subjectStudent.SubGroup),
                GroupId = groupId,
                HasProtection = studentsLabFiles.Any(x =>
                    x.UserId == studentId && !x.IsReceived && !x.IsReturned && !x.IsCoursProject)
            };
        }

        public List<SubGroupViewData> GetSubGroups(int subjectId, int groupId)
        {
            var subGroups = this.SubjectManagementService.GetSubGroupsV2WithScheduleProtectionLabs(subjectId, groupId);
            return subGroups.Select(x => new SubGroupViewData(x)).ToList();
        }
    }
}
