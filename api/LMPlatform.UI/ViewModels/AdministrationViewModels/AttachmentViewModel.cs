using Application.Core;
using Application.Infrastructure.FilesManagement;
using LMPlatform.Models;
using System;

namespace LMPlatform.UI.ViewModels.AdministrationViewModels
{
    public class AttachmentViewModel 
    {
        private readonly LazyDependency<IFilesManagementService> _filesManagementService = new LazyDependency<IFilesManagementService>();


        public string Name { get; set; }

        public string FileName { get; set; }

        public string PathName { get; set; }

        public AttachmentType AttachmentType { get; set; }

        public string CreationDate { get; set; }

        public long? FileSize { get; set; }

        public string? AuthorName { get; set; }


        private IFilesManagementService FilesManagementService => _filesManagementService.Value;


        public AttachmentViewModel(Attachment attachment) 
        {
            Name = attachment.Name;
            FileName = attachment.FileName;
            PathName = attachment.PathName;
            AttachmentType = attachment.AttachmentType;
            CreationDate = attachment.CreationDate?.ToString("o");
            AuthorName = attachment.Author?.UserName;
            FileSize = FilesManagementService.GetFileSize(attachment);
        }
    }
}