using Application.Core;
using Application.Core.Data;
using Application.Infrastructure.FilesManagement;
using Application.Infrastructure.GroupManagement;
using Application.Infrastructure.SubjectManagement;
using LMPlatform.Models;
using LMPlatform.UI.Services.Modules.CoreModels;
using LMPlatform.UI.Services.Modules.Labs;
using System;
using System.Collections.Generic;
using System.Linq;

namespace LMPlatform.UI.Services.Courses
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "CoursesService" in code, svc and config file together.
    // NOTE: In order to launch WCF Test Client for testing this service, please select CoursesService.svc or CoursesService.svc.cs at the Solution Explorer and start debugging.
    public class CoursesService : ICoursesService
    {
        private readonly LazyDependency<ISubjectManagementService> subjectManagementService = new LazyDependency<ISubjectManagementService>();

        public ISubjectManagementService SubjectManagementService => subjectManagementService.Value;

        private readonly LazyDependency<IFilesManagementService> filesManagementService = new LazyDependency<IFilesManagementService>();

        public IFilesManagementService FilesManagementService => filesManagementService.Value;

        private readonly LazyDependency<IGroupManagementService> groupManagementService = new LazyDependency<IGroupManagementService>();

        public IGroupManagementService GroupManagementService => groupManagementService.Value;

        public UserLabFilesResult GetFiles(int userId, int subjectId)
        {
            try
            {
                var courseFiles = SubjectManagementService.GetUserCourseFiles(userId, subjectId);

                var model = courseFiles
                    .OrderBy(e => e.Date)
                    .Select(e =>
                    {
                        var attachments = FilesManagementService.GetAttachments(e.Attachments).ToList();
                        var firstAttachment = attachments.FirstOrDefault();
                        long? fileSizeBytes = firstAttachment != null ? FilesManagementService.GetFileSize(firstAttachment) : (long?)null;

                        double? fileSizeKb = fileSizeBytes.HasValue ? Math.Round(fileSizeBytes.Value / 1024.0, 2) : (double?)null;

                        return new UserLabFileViewData
                        {
                            Comments = e.Comments,
                            Id = e.Id,
                            PathFile = e.Attachments,
                            IsReceived = e.IsReceived,
                            IsReturned = e.IsReturned,
                            IsCoursProject = e.IsCoursProject,
                            UserId = e.UserId,
                            Date = e.Date != null ? e.Date.Value.ToString("dd.MM.yyyy HH:mm") : string.Empty,
                            Attachments = attachments,
                            fileSize = fileSizeKb.ToString() + " КБ",
                        };
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

        public StudentsMarksResult GetFilesV2(int subjectId, int groupId, bool isCp)
        {
            try
            {
                var group = GroupManagementService.GetGroups(
                    new Query<Group>(e => e.SubjectGroups.Any(x => x.SubjectId == subjectId && x.GroupId == groupId))
                        .Include(e => e.Students.Select(s => s.User))
                ).FirstOrDefault();

                if (group == null)
                {
                    return new StudentsMarksResult
                    {
                        Students = new List<StudentMark>(),
                        Message = "Группа не найдена",
                        Code = "500"
                    };
                }

                IList<SubGroup> subGroups = SubjectManagementService.GetSubGroupsV2(subjectId, group.Id);

                var students = new List<StudentMark>();

                foreach (var student in group.Students
                    .Where(s => s.IsActive.HasValue && s.IsActive.Value && s.Confirmed.HasValue && s.Confirmed.Value)
                    .OrderBy(s => s.LastName))
                {
                    var courseFiles = SubjectManagementService.GetUserCourseFiles(student.Id, subjectId)
                        .OrderBy(e => e.Date)
                        .Select(e =>
                        {
                            var attachments = FilesManagementService.GetAttachments(e.Attachments).ToList();
                            var firstAttachment = attachments.FirstOrDefault();
                            long? fileSizeBytes = firstAttachment != null ? FilesManagementService.GetFileSize(firstAttachment) : (long?)null;

                            double? fileSizeKb = fileSizeBytes.HasValue ? Math.Round(fileSizeBytes.Value / 1024.0, 2) : (double?)null;

                            return new UserLabFileViewData
                            {
                                Comments = e.Comments,
                                Id = e.Id,
                                PathFile = e.Attachments,
                                IsReceived = e.IsReceived,
                                IsReturned = e.IsReturned,
                                IsCoursProject = e.IsCoursProject,
                                UserId = e.UserId,
                                Date = e.Date != null ? e.Date.Value.ToString("dd.MM.yyyy HH:mm") : string.Empty,
                                Attachments = attachments,
                                fileSize = fileSizeKb.ToString() + " КБ",
                            };
                        }).ToList();

                    int subGroupNumber = subGroups.FirstOrDefault(x => x.Name == "first")?.SubjectStudents.Any(x => x.StudentId == student.Id) == true ? 1 :
                                         subGroups.FirstOrDefault(x => x.Name == "second")?.SubjectStudents.Any(x => x.StudentId == student.Id) == true ? 2 :
                                         subGroups.FirstOrDefault(x => x.Name == "third")?.SubjectStudents.Any(x => x.StudentId == student.Id) == true ? 3 : 4;

                    students.Add(new StudentMark
                    {
                        StudentId = student.Id,
                        FullName = student.FullName,
                        SubGroup = subGroupNumber,
                        FileLabs = courseFiles
                    });
                }

                return new StudentsMarksResult
                {
                    Students = students,
                    Message = "Данные получены",
                    Code = "200"
                };
            }
            catch (Exception ex)
            {
                return new StudentsMarksResult
                {
                    Students = new List<StudentMark>(),
                    Message = $"Произошла ошибка при получении результатов студентов: {ex.Message}",
                    Code = "500"
                };
            }
        }

    }
}
