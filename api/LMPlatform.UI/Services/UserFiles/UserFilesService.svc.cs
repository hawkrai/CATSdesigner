using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Web;
using Application.Core;
using Application.Core.Data;
using Application.Infrastructure.FilesManagement;
using Application.Infrastructure.StudentManagement;
using Application.Infrastructure.SubjectManagement;
using LMPlatform.Models;
using LMPlatform.PlagiarismNet.Controllers;
using LMPlatform.UI.Services.Modules;
using LMPlatform.UI.Services.Modules.Labs;
using Newtonsoft.Json;

namespace LMPlatform.UI.Services.UserFiles
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "UserFilesService" in code, svc and config file together.
    // NOTE: In order to launch WCF Test Client for testing this service, please select UserFilesService.svc or UserFilesService.svc.cs at the Solution Explorer and start debugging.
    public class UserFilesService : IUserFilesService
    {
        public string PlagiarismTempPath => ConfigurationManager.AppSettings["PlagiarismTempPath"];

        public string FileUploadPath => ConfigurationManager.AppSettings["FileUploadPath"];


		private readonly LazyDependency<ISubjectManagementService> subjectManagementService = new LazyDependency<ISubjectManagementService>();

        public ISubjectManagementService SubjectManagementService => subjectManagementService.Value;

        private readonly LazyDependency<IFilesManagementService> filesManagementService = new LazyDependency<IFilesManagementService>();

        public IFilesManagementService FilesManagementService => filesManagementService.Value;


        private readonly LazyDependency<IStudentManagementService> studentManagementService = new LazyDependency<IStudentManagementService>();

        public IStudentManagementService StudentManagementService => studentManagementService.Value;

		public UserLabFileViewData SendFile(int subjectId, int userId, int id, string comments, string pathFile, string attachments, bool isCp = false, bool isRet = false, int? labId = null, int? practicalId = null)
        {
            try
            {
                var attachmentsModel = JsonConvert.DeserializeObject<List<Attachment>>(attachments).ToList();

                var userLabFile = SubjectManagementService.SaveUserLabFiles(new UserLabFiles
                {
                    SubjectId = subjectId,
                    Date = DateTime.Now,
                    UserId = userId,
                    Comments = comments,
                    Attachments = pathFile,
                    Id = id,
                    LabId = labId,
                    PracticalId = practicalId,
                    IsCoursProject = isCp,
                    IsReceived = false,
                    IsReturned = isRet
                }, attachmentsModel);

                return new UserLabFileViewData()
                {
                    Message = "Файл(ы) успешно отправлен(ы)",
                    Code = "200",
                    Comments = userLabFile.Comments,
                    Id = userLabFile.Id,
                    PathFile = userLabFile.Attachments,
                    IsReceived = userLabFile.IsReceived,
                    IsReturned = userLabFile.IsReturned,
                    IsCoursProject = userLabFile.IsCoursProject,
                    LabId = userLabFile.LabId,
                    LabShortName = userLabFile.Lab?.ShortName,
                    LabTheme = userLabFile.Lab?.Theme,
                    Date = userLabFile.Date != null ? userLabFile.Date.Value.ToString("dd.MM.yyyy HH:mm") : string.Empty,
                    Attachments = FilesManagementService.GetAttachments(userLabFile.Attachments).ToList(),
                    UserId = userLabFile.UserId,
                    Order = userLabFile.Lab?.Order,
					PracticalId = practicalId,
					PracticalTheme = userLabFile.Practical?.Theme,
					PracticalShortName = userLabFile.Practical?.ShortName,
                };
            }
            catch
            {
                return new UserLabFileViewData
                {
                    Message = "Произошла ошибка",
                    Code = "500"
                };
            }
        }

        public ResultViewData DeleteUserFile(int id)
        {
            try
            {
                SubjectManagementService.DeleteUserLabFile(id);
                return new ResultViewData
                {
                    Message = "Работа удалена",
                    Code = "200"
                };
            }
            catch (Exception e)
            {
                return new ResultViewData
                {
                    Message = "Произошла ошибка при удалении работы - " + e.Message,
                    Code = "500"
                };
            }
        }

        public ResultViewData ReceivedFile(int userFileId)
        {
            try
            {
                this.SubjectManagementService.UpdateUserFile(userFileId, true);
                return new ResultViewData
                {
                    Message = "Файл(ы) перемещен(ы) в архив",
                    Code = "200"
                };
            }
            catch
            {
                return new ResultViewData
                {
                    Message = "Произошла ошибка переноса файла в архив",
                    Code = "500"
                };
            }
        }

        public ResultViewData ReturnFile(int userFileId)
        {
            try
            {
                SubjectManagementService.UpdateUserFile(userFileId, isReturned: true);
                return new ResultViewData
                {
                    Message = "Файл отправлен на доработку",
                    Code = "200"
                };
            }
            catch
            {
                return new ResultViewData
                {
                    Code = "500",
                    Message = "Не удалось отправить файл на доработку"
                };
            }
        }

        public ResultViewData CancelReceivedFile(int userFileId)
        {
            try
            {
                SubjectManagementService.UpdateUserFile(userFileId);
                return new ResultViewData
                {
                    Message = "Файл(ы) перемещен(ы) из архива",
                    Code = "200"
                };
            }
            catch
            {
                return new ResultViewData
                {
                    Message = "Произошла ошибка переноса файла из архива",
                    Code = "500"
                };
            }
        }

		public ResultPSubjectViewData CheckPlagiarismSubjects(string subjectId, int type, int threshold, bool isCp = false, bool isLab = false, bool isPractical = false)
		{
			var path = Guid.NewGuid().ToString("N");

			try
			{
				ClearCache();

				var subjectName = this.SubjectManagementService.GetSubject(int.Parse(subjectId)).ShortName;

				Directory.CreateDirectory(this.PlagiarismTempPath + path);

				var usersFiles = this.SubjectManagementService.GetUserFiles(0, int.Parse(subjectId)).Where(e => e.IsReceived && (e.IsCoursProject == isCp || (isLab && (e.LabId.HasValue || !e.LabId.HasValue && !e.PracticalId.HasValue)) || (isPractical && e.PracticalId.HasValue)));

				var filesPaths = usersFiles.Select(e => e.Attachments);

				var key = 0;

				if (filesPaths.Count() == 0)
				{
					return new ResultPSubjectViewData
					{
						Message = "Отсутствуют принятые работы для проверки на плагиат",
						Code = "500"
					};
				}

				foreach (var filesPath in filesPaths)
				{
					if (Directory.Exists(this.FileUploadPath + filesPath))
					{
						foreach (var srcPath in Directory.GetFiles(this.FileUploadPath + filesPath))
						{
							File.Copy(srcPath,
								srcPath.Replace(this.FileUploadPath + filesPath, this.PlagiarismTempPath + path), true);
						}
					}
					key += filesPath.GetHashCode();
				}

				var plagiarismController = new PlagiarismController();
				var result = plagiarismController.CheckByDirectory(new[] { PlagiarismTempPath + path }.ToList(), threshold, 10, type);

				var data = new ResultPlagSubjectClu
				{
					clusters = new ResultPlagSubject[result.Count]
				};

				for (int i = 0; i < result.Count; ++i)
				{
					data.clusters[i] = new ResultPlagSubject();

					var correctDocs = new List<ResultPlag>();

					foreach (var doc in result[i].Docs)
					{
						var resultS = new ResultPlag();

						var fileName = Path.GetFileName(doc);

						resultS.DocFileName = fileName;

						var name = this.FilesManagementService.GetFileDisplayName(fileName);

						resultS.subjectName = subjectName;

						resultS.doc = name;

						var pathName = this.FilesManagementService.GetPathName(fileName);

						resultS.DocPathName = pathName;

						var userFileT = this.SubjectManagementService.GetUserLabFile(pathName);

						var userId = userFileT.UserId;

						var user = this.StudentManagementService.GetStudent(userId);

						resultS.author = user.FullName;

						resultS.groupName = user.Group.Name;

						correctDocs.Add(resultS);
					}
					data.clusters[i].correctDocs = correctDocs.OrderBy(x => x.groupName).ThenBy(x => x.author).ToList();
				}
				Directory.Delete(this.PlagiarismTempPath + path, true);

				HttpContext.Current.Session.Add(key.ToString(), data.clusters.ToList());

				return new ResultPSubjectViewData
				{
					DataD = data.clusters.ToList(),
					Message = "Проверка успешно завершена",
					Code = "200"
				};
			}
			catch (Exception e)
			{
				return new ResultPSubjectViewData
				{
					Message = e.Message + "   " + e,
					Code = "500"
				};
			}
			finally
			{
				var fullPath = this.PlagiarismTempPath + path;
				if (Directory.Exists(fullPath))
				{
					Directory.Delete(fullPath, true);
				}
			}
		}

		public ResultViewData CheckPlagiarism(int userFileId, int subjectId, bool isCp = false, bool isLab = false, bool isPractical = false)
		{
			var path = Guid.NewGuid().ToString("N");
			try
			{
				ClearCache();

				var subjectName = this.SubjectManagementService.GetSubject(new Query<Subject>(e => e.Id == subjectId)).ShortName;

				var key = 0;

				Directory.CreateDirectory(this.PlagiarismTempPath + path);

				var userFile = this.SubjectManagementService.GetUserLabFile(userFileId);

				var usersFiles = this.SubjectManagementService.GetUserLabFiles(0, subjectId)
					.Where(e => e.IsReceived && e.Id != userFile.Id && (e.IsCoursProject == isCp || (isLab && (e.LabId.HasValue || !e.LabId.HasValue && !e.PracticalId.HasValue)) || (isPractical && e.PracticalId.HasValue)));

				var filesPaths = usersFiles.Select(e => e.Attachments);

				if (filesPaths.Count() == 0)
				{
					return new ResultViewData
					{
						Message = "Отсутствуют принятые работы для проверки на плагиат",
						Code = "200"
					};
				}

				foreach (var filesPath in filesPaths)
				{
					foreach (var srcPath in Directory.GetFiles(this.FileUploadPath + filesPath))
					{
						File.Copy(srcPath, srcPath.Replace(this.FileUploadPath + filesPath, this.PlagiarismTempPath + path), true);
					}

					key += filesPath.GetHashCode();
				}

				string firstFileName =
					Directory.GetFiles(FileUploadPath + userFile.Attachments)
					.Select(fi => fi)
					.FirstOrDefault();

				var plagiarismController = new PlagiarismController();
				var result = plagiarismController.CheckBySingleDoc(firstFileName, new[] { PlagiarismTempPath + path }.ToList(), 10, 10);

				var data = new List<ResultPlag>();

				foreach (var res in result)
				{
					var resPlag = new ResultPlag();

					var fileName = Path.GetFileName(res.Doc);

					resPlag.DocFileName = fileName;

					var name = FilesManagementService.GetFileDisplayName(fileName);

					resPlag.doc = name;

					resPlag.subjectName = subjectName;

					resPlag.coeff = res.Coeff.ToString();

					var pathName = FilesManagementService.GetPathName(fileName);

					resPlag.DocPathName = pathName;

					var userFileT = SubjectManagementService.GetUserLabFile(pathName);

					var userId = userFileT.UserId;

					var user = StudentManagementService.GetStudent(userId);

					resPlag.author = user.FullName;

					resPlag.groupName = user.Group.Name;

					data.Add(resPlag);
				}

				HttpContext.Current.Session.Add(key.ToString(), data.ToList());

				return new ResultViewData
				{
					DataD = data.OrderByDescending(x => int.Parse(x.coeff)).ToList(),
					Message = "Проверка успешно завершена",
					Code = "200"
				};
			}
			catch (Exception e)
			{
				return new ResultViewData
				{
					Message = e.Message + "   " + e,
					Code = "500"
				};
			}
			finally
			{
				var fullPath = PlagiarismTempPath + path;
				if (Directory.Exists(fullPath))
				{
					Directory.Delete(fullPath, true);
				}
			}
		}

		private static void ClearCache()
		{
			foreach (DictionaryEntry entry_loopVariable in HttpContext.Current.Cache)
			{
				var entry = entry_loopVariable;
				HttpContext.Current.Cache.Remove(entry.Key.ToString());
			}

			IDictionaryEnumerator enumerator = HttpContext.Current.Cache.GetEnumerator();

			while (enumerator.MoveNext())
			{
				HttpContext.Current.Cache.Remove(enumerator.Key.ToString());
			}
			HttpContext.Current.Response.ClearHeaders();
			HttpContext.Current.Response.Expires = 0;
			HttpContext.Current.Response.CacheControl = "no-cache";
			HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.ServerAndNoCache);
			HttpContext.Current.Response.Cache.SetNoStore();
			HttpContext.Current.Response.Buffer = true;
			HttpContext.Current.Response.ExpiresAbsolute = DateTime.Now.Subtract(new TimeSpan(1, 0, 0, 0));
			HttpContext.Current.Response.AppendHeader("Pragma", "no-cache");
			HttpContext.Current.Response.AppendHeader("", "");
			HttpContext.Current.Response.AppendHeader("Cache-Control", "no-cache"); //HTTP 1.1
			HttpContext.Current.Response.AppendHeader("Cache-Control", "private"); // HTTP 1.1
			HttpContext.Current.Response.AppendHeader("Cache-Control", "no-store"); // HTTP 1.1
			HttpContext.Current.Response.AppendHeader("Cache-Control", "must-revalidate"); // HTTP 1.1
			HttpContext.Current.Response.AppendHeader("Cache-Control", "max-stale=0"); // HTTP 1.1
			HttpContext.Current.Response.AppendHeader("Cache-Control", "post-check=0"); // HTTP 1.1
			HttpContext.Current.Response.AppendHeader("Cache-Control", "pre-check=0"); // HTTP 1.1
			HttpContext.Current.Response.AppendHeader("Pragma", "no-cache"); // HTTP 1.1
			HttpContext.Current.Response.AppendHeader("Keep-Alive", "timeout=3, max=993"); // HTTP 1.1
		}

	}
}
