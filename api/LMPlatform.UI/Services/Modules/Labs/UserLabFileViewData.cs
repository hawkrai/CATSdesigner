using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using LMPlatform.Models;
using LMPlatform.UI.Services.Modules.Lectures;

namespace LMPlatform.UI.Services.Modules.Labs
{
    [DataContract]
    public class UserLabFileViewData : ResultViewData
    {
        [DataMember]
		public int Id { get; set; }
        [DataMember]
        public string Comments { get; set; }
		[DataMember]
		public string PathFile { get; set; }
        [DataMember]
        public string Date { get; set; }
        [DataMember]
        public List<Attachment> Attachments { get; set; }
		[DataMember]
		public bool IsReceived { get; set; }
        [DataMember]
        public bool IsReturned { get; set; }
        [DataMember]
        public bool IsCoursProject { get; set; }
        [DataMember]
        public int? LabId { get; set; }

        [DataMember]
        public int UserId { get; set; }

        [DataMember]
        public string LabShortName { get; set; }

        [DataMember]
        public string LabTheme { get; set; }

        [DataMember]
        public int? Order { get; set; }
    }
}