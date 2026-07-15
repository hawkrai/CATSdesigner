using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using Application.Core;
using Application.Core.Exceptions;
using Application.Core.Helpers;
using Application.Core.UI;
using Application.Core.UI.Controllers;
using Application.Infrastructure.FilesManagement;
using Application.Infrastructure.UserManagement;
using JWT.Algorithms;
using JWT.Builder;
using LMPlatform.Models;
using LMPlatform.UI.Attributes;
using Newtonsoft.Json;

namespace LMPlatform.UI.ApiControllers
{
    [JwtAuth]
    public class UploadController : ApiController
    {
        private readonly LazyDependency<IFilesManagementService> _filesManagementService = new LazyDependency<IFilesManagementService>();
        private readonly LazyDependency<IUsersManagementService> _usersManagementService = new LazyDependency<IUsersManagementService>();

        public IFilesManagementService FilesManagementService
        {
            get
            {
                return _filesManagementService.Value;
            }
        }

        public IUsersManagementService UsersManagementService
        {
            get
            {
                return _usersManagementService.Value;
            }
        }

        #region UploadController Members

        [System.Web.Http.HttpPost]
        public HttpStatusCodeResult DeleteFiles(string filename)
        {
            try
            {
                var split = filename.Split(new string[] { "//" }, StringSplitOptions.None);
                FilesManagementService.DeleteFileAttachment(split[0], split[1]);
                return new HttpStatusCodeResult(HttpStatusCode.OK);
            } catch (Exception ex)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, ex.Message);
            }
        }

        [System.Web.Http.HttpGet]
        public HttpResponseMessage DownloadFile(string fileName)
        {
            if (!string.IsNullOrEmpty(fileName))
            {
                var requester = GetRequestUser();

                if (requester != null && requester.Role == "student")
                {
                    var split = fileName.Split(new string[] { "//" }, StringSplitOptions.None);
                    if (split.Length < 2)
                    {
                        return new HttpResponseMessage(HttpStatusCode.BadRequest);
                    }

                    var attachments = FilesManagementService.GetAttachments(split[0]);
                    var attachment = attachments.FirstOrDefault(a => a.FileName == split[1]);

                    if (attachment == null || !StudentCanDownload(attachment, requester.Id))
                    {
                        return new HttpResponseMessage(HttpStatusCode.Forbidden);
                    }
                }

                return DownloadFileContent(fileName);
            }

            return new HttpResponseMessage(HttpStatusCode.BadRequest);
        }

        private bool StudentCanDownload(Attachment attachment, int studentUserId)
        {
            if (!attachment.UserId.HasValue || attachment.UserId.Value == studentUserId)
            {
                return true;
            }

            var uploader = UsersManagementService.GetUser(attachment.UserId.Value);
            var uploaderIsStudent = uploader?.Student != null && uploader.Lecturer == null;
            return !uploaderIsStudent;
        }

        private class RequestUser
        {
            public int Id { get; set; }
            public string Role { get; set; }
        }

        private static RequestUser GetRequestUser()
        {
            try
            {
                var request = HttpContext.Current?.Request;
                if (request == null)
                {
                    return null;
                }

                var authCookie = request.Cookies["Authorization"];
                var authHeader = request.Headers["Authorization"];
                var token = authCookie != null ? authCookie.Value : authHeader?.Replace("Bearer", string.Empty).Trim();
                if (string.IsNullOrEmpty(token))
                {
                    return null;
                }

                var tokenSecret = ConfigurationManager.AppSettings["jwt:secret"];
                var json = new JwtBuilder()
                    .WithSecret(tokenSecret)
                    .WithAlgorithm(new HMACSHA256Algorithm())
                    .MustVerifySignature()
                    .Decode<IDictionary<string, string>>(token);

                return new RequestUser
                {
                    Id = int.TryParse(json["id"], out var id) ? id : 0,
                    Role = json[System.Security.Claims.ClaimsIdentity.DefaultRoleClaimType]
                };
            }
            catch
            {
                return null;
            }
        }

        [System.Web.Http.HttpGet]
        public IEnumerable<AttachedFile> GetUploadedFiles(string values, string deleteValues)
        {
            if (!string.IsNullOrEmpty(values))
            {
                return _GetUploadedFiles(values, deleteValues);
            }
            else
            {
                return new List<AttachedFile>();
            }
        }

        [System.Web.Http.HttpPost]
        public IEnumerable<AttachedFile> UploadFiles()
        {
            return _UploadFile(HttpContext.Current);
        }

        #endregion UploadController Members

        #region Fields

        private readonly string _storageRoot = ConfigurationManager.AppSettings["FileUploadPath"];
        private readonly string _storageRootTemp = ConfigurationManager.AppSettings["FileUploadPathTemp"];

        #endregion Fields

        #region Private Members

        private HttpResponseMessage DownloadFileContent(string fileName)
        {
            var filePath = _storageRoot + fileName;
            if (File.Exists(filePath))
            {
                var response = new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new StreamContent(new FileStream(filePath, FileMode.Open, FileAccess.Read))
                };

                var extension = Path.GetExtension(fileName).ToLower();
                var contentType = extension == ".pdf" ? "application/pdf" : "application/octet-stream";
                response.Content.Headers.ContentType = new MediaTypeHeaderValue(contentType);

                if (HttpContext.Current.Request.Browser.Browser == "IE")
                {
                    response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
                    {
                        FileName = HttpUtility.UrlPathEncode(FilesManagementService.GetFileDisplayName(Path.GetFileName(filePath))),
                    };
                }
                else
                {
                    response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
                    {
                        FileName = FilesManagementService.GetFileDisplayName(Path.GetFileName(filePath))
                    };
                }

                return response;
            }

            return null;
        }

        private IEnumerable<AttachedFile> _GetUploadedFiles(string filesPath, string deleteValues)
        {
            var values = JsonConvert.DeserializeObject<List<string>>(filesPath);
            var files = new List<AttachedFile>();

            foreach (var split in values.Select(value => value.Split(new[] { '/' })))
            {
                var filePath = _storageRoot + split[2] + "//" + split[3];
                if (File.Exists(filePath))
                {
                    var file = new AttachedFile(split[0], split[3], new FileInfo(filePath), Convert.ToInt32(split[1]), deleteValues);
                    files.Add(file);
                }
            }

            return files;
        }

        private string _GetFileType(HttpPostedFile fileType)
        {
            var split = fileType.ContentType.Split(new[] { '/' });
            switch (split[0])
            {
                case "image":
                    return "Image";
                case "video":
                    return "Video";
                case "audio":
                    return "Audio";
            }

            return "Document";
        }

        private IEnumerable<AttachedFile> _UploadFile(HttpContext context)
        {
            var statuses = new List<AttachedFile>();

            for (var i = 0; i < context.Request.Files.Count; i++)
            {
                var file = context.Request.Files[i];
                var guidFileName = GetGuidFileName() + Path.GetExtension(file.FileName.ToLower());
                var fullPath = _storageRootTemp + guidFileName;

                file.SaveAs(fullPath);

                statuses.Add(new AttachedFile(Path.GetFileName(file.FileName), guidFileName, new FileInfo(fullPath), file.ContentLength, fullPath, "DELETE"));
            }

            return statuses;
        }

        private string GetGuidFileName()
        {
            return string.Format("N{0}", Guid.NewGuid().ToString("N").ToUpper());
        }

        #endregion Private Members
    }
}