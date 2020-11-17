using System.Runtime.Serialization;

namespace LMPlatform.UI.Services.Modules.News
{
    using Application.Core;
    using Application.Infrastructure.FilesManagement;
    using Models;
    using System.Collections.Generic;

    [DataContract]
    public class NewsViewData
    {
        private readonly LazyDependency<IFilesManagementService> filesManagementService = new LazyDependency<IFilesManagementService>();

        public IFilesManagementService FilesManagementService
        {
            get
            {
                return filesManagementService.Value;
            }
        }

        public NewsViewData()
        {
        }

        public NewsViewData(SubjectNews news)
        {
            Body = news.Body;
            NewsId = news.Id;
            Title = news.Title;
            SubjectId = news.SubjectId;
            DateCreate = news.EditDate.ToShortDateString();
	        Disabled = news.Disabled;
            Attachments = FilesManagementService.GetAttachments(news.Attachments);
        }

        [DataMember]
        public int NewsId { get; set; }

        [DataMember]
        public int SubjectId { get; set; }

        [DataMember]
        public string Title { get; set; }

        [DataMember]
        public string Body { get; set; }

        [DataMember]
        public string DateCreate { get; set; }

		[DataMember]
        public bool Disabled { get; set; }

        [DataMember]
        public IList<Attachment> Attachments { get; set; }
    }
}
