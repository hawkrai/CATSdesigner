using System;
using System.Collections.Generic;
using LMPlatform.Models;

namespace Application.Infrastructure.FilesManagement
{
    public interface IFilesManagementService
    {
        void DeleteFileAttachment(Attachment attachment);

        void DeleteFileAttachment(string filePath, string fileName);

        string GetFileDisplayName(string guid);

        void SaveFiles(IEnumerable<Attachment> attachment, string path = "");

        void SaveFiles(IEnumerable<Attachment> attachments, Func<Attachment, string> property);

        IList<Attachment> GetAttachments(string path);

        IList<Attachment> GetAttachmentsByIds(IEnumerable<int> ids);

        IList<Attachment> GetAttachments(string filter, int filesPerPage, int page);

        string GetPathName(string guid);

        void SaveFile(Attachment attachment, string folder);

        string GetFullPath(Attachment attachment);
    }
}