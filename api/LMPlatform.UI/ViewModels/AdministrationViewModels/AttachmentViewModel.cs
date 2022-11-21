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

        public string CreationDateString { get; set; }

        public User? Author { get; set; }

        public long? FileSize { get; set; }

        public string AuthorName => Author?.FullName;


        private IFilesManagementService FilesManagementService => _filesManagementService.Value;


        public AttachmentViewModel(Attachment attachment) 
        {
            Name = attachment.Name;
            FileName = attachment.FileName;
            PathName = attachment.PathName;
            AttachmentType = attachment.AttachmentType;
            CreationDateString = attachment.CreationDate?.ToString("dd/MM/yyyy");
            Author = attachment.Author;
            FileSize = FilesManagementService.GetFileSize(attachment);
        }
    }
}