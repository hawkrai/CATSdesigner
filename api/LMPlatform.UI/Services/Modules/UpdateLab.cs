using LMPlatform.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace LMPlatform.UI.Services.Modules
{
	[DataContract]
	public class UpdateLab
	{
		[DataMember]
		public int Id { get; set; }
		[DataMember]
		public int Order { get; set; } 

		[DataMember]
		public int SubjectId { get; set; }
		[DataMember]
		public string ShortName { get; set; }

		[DataMember]
		public string Theme { get; set; }
		[DataMember]
		public int Duration { get; set; }
		[DataMember]
		public string PathFile { get; set; }

		[DataMember]
		public string Attachments { get; set; }

	}
}