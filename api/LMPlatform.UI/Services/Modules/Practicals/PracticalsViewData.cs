namespace LMPlatform.UI.Services.Modules.Practicals
{
    using System.Collections.Generic;
    using System.Runtime.Serialization;

    using Application.Core;
    using Application.Infrastructure.FilesManagement;

    using LMPlatform.Models;
    using LMPlatform.UI.Services.Modules.Schedule;

    [DataContract]
    public class PracticalsViewData
    {
        private readonly LazyDependency<IFilesManagementService> filesManagementService = new LazyDependency<IFilesManagementService>();

        public IFilesManagementService FilesManagementService
        {
            get
            {
                return filesManagementService.Value;
            }
        }

        public PracticalsViewData(Practical practical)
        {
            Theme = practical.Theme;
            PracticalId = practical.Id;
            Duration = practical.Duration;
            SubjectId = practical.SubjectId;
            Order = practical.Order;
            PathFile = practical.Attachments;
            ShortName = practical.ShortName;
            Attachments = string.IsNullOrWhiteSpace(practical.Attachments) ? new List<Attachment>() : FilesManagementService.GetAttachments(practical.Attachments);
        }

        [DataMember]
        public int Order { get; set; }

        [DataMember]
        public string ShortName { get; set; }

        [DataMember]
        public int PracticalId { get; set; }

        [DataMember]
        public int SubjectId { get; set; }

        [DataMember]
        public string Theme { get; set; }

        [DataMember]
        public int Duration { get; set; }

        [DataMember]
        public string PathFile { get; set; }

        [DataMember]
        public IList<Attachment> Attachments { get;  set; }

        [DataMember]
        public List<ScheduleProtectionLesson> ScheduleProtectionPracticalsRecommended { get; set; }
    }
}