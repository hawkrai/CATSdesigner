using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using Application.Core;
using Application.Core.Helpers;
using Application.Core.SLExcel;
using Application.Infrastructure.FilesManagement;
using Application.Infrastructure.GroupManagement;
using Application.Infrastructure.LecturerManagement;
using Application.Infrastructure.StudentManagement;
using Application.Infrastructure.SubjectManagement;
using LMPlatform.UI.Attributes;
using LMPlatform.UI.Services.Modules;

namespace LMPlatform.UI.Controllers
{
    [JwtAuth]
    public class StatisticController : Controller
    {
        private readonly LazyDependency<IFilesManagementService> filesManagementService =
            new LazyDependency<IFilesManagementService>();

        private readonly LazyDependency<IGroupManagementService> groupManagementService =
            new LazyDependency<IGroupManagementService>();

        private readonly LazyDependency<ILecturerManagementService> lecturerManagementService =
            new LazyDependency<ILecturerManagementService>();

        private readonly LazyDependency<IStudentManagementService> studentManagementService =
            new LazyDependency<IStudentManagementService>();

        private readonly LazyDependency<ISubjectManagementService> subjectManagementService =
            new LazyDependency<ISubjectManagementService>();

        public IGroupManagementService GroupManagementService => this.groupManagementService.Value;

        public ILecturerManagementService LecturerManagementService => this.lecturerManagementService.Value;

        public ISubjectManagementService SubjectManagementService => this.subjectManagementService.Value;

        public string PlagiarismUrl => ConfigurationManager.AppSettings["PlagiarismUrl"];

        public string PlagiarismTempPath => ConfigurationManager.AppSettings["PlagiarismTempPath"];

        public string FileUploadPath => ConfigurationManager.AppSettings["FileUploadPath"];

        public IFilesManagementService FilesManagementService => this.filesManagementService.Value;

        public IStudentManagementService StudentManagementService => this.studentManagementService.Value;

        public void GetVisitLecture(int subjectId, int groupId)
        {
            var data = new SLExcelData();

            var headerData = this.LecturerManagementService.GetLecturesScheduleVisitings(subjectId);
            var rowsData = this.LecturerManagementService.GetLecturesScheduleMarks(subjectId, groupId);

            data.Headers.Add("Студент");
            data.Headers.AddRange(headerData);
            data.DataRows.AddRange(rowsData);

            var file = new SLExcelWriter().GenerateExcel(data);

            this.Response.Clear();
            this.Response.Charset = "ru-ru";
            this.Response.HeaderEncoding = Encoding.UTF8;
            this.Response.ContentEncoding = Encoding.UTF8;
            this.Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            this.Response.AddHeader("Content-Disposition", "attachment; filename=LectureVisiting.xlsx");
            this.Response.BinaryWrite(file);
            this.Response.Flush();
            this.Response.End();
        }

        public void GetVisitCP(int subjectId, int groupId)
        {
            var data = new SLExcelData();

            var headerData = this.GroupManagementService.GetCpScheduleVisitings(subjectId, groupId, UserContext.CurrentUserId);
            var rowsData = this.GroupManagementService.GetCpScheduleMarks(subjectId, groupId, UserContext.CurrentUserId);

            data.Headers.Add("Студент");
            data.Headers.AddRange(headerData);
            data.DataRows.AddRange(rowsData);

            var file = new SLExcelWriter().GenerateExcel(data);

            this.Response.Clear();
            this.Response.Charset = "ru-ru";
            this.Response.HeaderEncoding = Encoding.UTF8;
            this.Response.ContentEncoding = Encoding.UTF8;
            this.Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            this.Response.AddHeader("Content-Disposition", "attachment; filename=CPVisiting.xlsx");
            this.Response.BinaryWrite(file);
            this.Response.Flush();
            this.Response.End();
        }

        public void GetPercentageCP(int subjectId, int groupId)
        {
            var data = new SLExcelData();

            var headerData = this.GroupManagementService.GetCpPercentage(subjectId, groupId, UserContext.CurrentUserId);
            var rowsData = this.GroupManagementService.GetCpMarks(subjectId, groupId, UserContext.CurrentUserId);

            data.Headers.Add("Студент");
            data.Headers.AddRange(headerData);
            data.Headers.Add("Оценка");
            data.DataRows.AddRange(rowsData);

            var file = new SLExcelWriter().GenerateExcel(data);

            this.Response.Clear();
            this.Response.Charset = "ru-ru";
            this.Response.HeaderEncoding = Encoding.UTF8;
            this.Response.ContentEncoding = Encoding.UTF8;
            this.Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            this.Response.AddHeader("Content-Disposition", "attachment; filename=PercentageCP.xlsx");
            this.Response.BinaryWrite(file);
            this.Response.Flush();
            this.Response.End();
        }

        public void GetVisitLabs(int subjectId, int groupId, int subGroupOneId, int subGroupTwoId)
        {
            var data = new SLExcelData();

            var rowsDataOne =
                this.GroupManagementService.GetLabsScheduleMarks(subjectId, groupId, subGroupOneId, subGroupTwoId);

            data.DataRows.AddRange(rowsDataOne);

            var file = new SLExcelWriter().GenerateExcel(data);

            this.Response.Clear();
            this.Response.Charset = "ru-ru";
            this.Response.HeaderEncoding = Encoding.UTF8;
            this.Response.ContentEncoding = Encoding.UTF8;
            this.Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            this.Response.AddHeader("Content-Disposition", "attachment; filename=LabVisiting.xlsx");
            this.Response.BinaryWrite(file);
            this.Response.Flush();
            this.Response.End();
        }

        public void GetLabsMarks(int subjectId, int groupId)
        {
            var data = new SLExcelData();

            var headerData = this.GroupManagementService.GetLabsNames(subjectId, groupId);
            var rowsData = this.GroupManagementService.GetLabsMarks(subjectId, groupId);

            data.Headers.Add("Студент");
            data.Headers.AddRange(headerData);
            data.DataRows.AddRange(rowsData);

            var file = new SLExcelWriter().GenerateExcel(data);

            this.Response.Clear();
            this.Response.Charset = "ru-ru";
            this.Response.HeaderEncoding = Encoding.UTF8;
            this.Response.ContentEncoding = Encoding.UTF8;
            this.Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            this.Response.AddHeader("Content-Disposition", "attachment; filename=LabMarks.xlsx");
            this.Response.BinaryWrite(file);
            this.Response.Flush();
            this.Response.End();
        }

        public void ExportPlagiarism(int subjectId, bool isCp = false)
        {
            var usersFiles = this.SubjectManagementService.GetUserLabFiles(0, subjectId)
                .Where(e => e.IsReceived && e.IsCoursProject == isCp);

            var filesPaths = usersFiles.Select(e => e.Attachments);

            var key = filesPaths.Sum(filesPath => filesPath.GetHashCode());

            var sessionData = this.Session[key.ToString()] as IEnumerable<ResultPlagSubject>;

            var data = new ResultPlagSubjectClu
            {
                clusters = sessionData.ToArray()
            };

            var dataE = new SLExcelData();
            dataE.Headers.Add("");
            dataE.Headers.Add("Автор");
            dataE.Headers.Add("Группа");
            dataE.Headers.Add("Предмет");
            dataE.Headers.Add("Файл");
            var i = 1;
            foreach (var resultPlagSubject in data.clusters.ToList())
            {
                dataE.DataRows.Add(new List<string> {"Кластер " + i});

                var listRows = resultPlagSubject.correctDocs.Select(correctDoc => new List<string>
                    {
                        "",
                        correctDoc.author,
                        correctDoc.groupName,
                        correctDoc.subjectName,
                        correctDoc.doc
                    })
                    .ToList();

                dataE.DataRows.AddRange(listRows);

                i += 1;
            }

            var file = new SLExcelWriter().GenerateExcel(dataE);

            this.Response.Clear();
            this.Response.Charset = "ru-ru";
            this.Response.HeaderEncoding = Encoding.UTF8;
            this.Response.ContentEncoding = Encoding.UTF8;
            this.Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            this.Response.AddHeader("Content-Disposition", "attachment; filename=PlagiarismResults.xlsx");
            this.Response.BinaryWrite(file);
            this.Response.Flush();
            this.Response.End();
        }

        public void ExportPlagiarismStudent(string userFileId, string subjectId, bool isCp = false)
        {
            var userFile = this.SubjectManagementService.GetUserLabFile(int.Parse(userFileId));

            var usersFiles = this.SubjectManagementService.GetUserLabFiles(0, int.Parse(subjectId))
                .Where(e => e.IsReceived && e.Id != userFile.Id && e.IsCoursProject == isCp);

            var filesPaths = usersFiles.Select(e => e.Attachments);

            var key = filesPaths.Sum(filesPath => filesPath.GetHashCode());

            var data = this.Session[key.ToString()] as IEnumerable<ResultPlag>;

            var dataE = new SLExcelData();
            dataE.Headers.Add("");
            dataE.Headers.Add("Процент схожести, %");
            dataE.Headers.Add("Автор");
            dataE.Headers.Add("Группа");
            dataE.Headers.Add("Предмет");
            dataE.Headers.Add("Файл");
            var listRows = data.Select(resultPlagSubject => new List<string>
                {
                    "",
                    resultPlagSubject.coeff,
                    resultPlagSubject.author,
                    resultPlagSubject.groupName,
                    resultPlagSubject.subjectName,
                    resultPlagSubject.doc
                })
                .ToList();

            dataE.DataRows.AddRange(listRows);

            var file = new SLExcelWriter().GenerateExcel(dataE);

            this.Response.Clear();
            this.Response.Charset = "ru-ru";
            this.Response.HeaderEncoding = Encoding.UTF8;
            this.Response.ContentEncoding = Encoding.UTF8;
            this.Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            this.Response.AddHeader("Content-Disposition", "attachment; filename=PlagiarismResults.xlsx");
            this.Response.BinaryWrite(file);
            this.Response.Flush();
            this.Response.End();
        }
    }
}