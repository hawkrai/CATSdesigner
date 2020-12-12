using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace LMPlatform.UI.Services.Modules
{
	[DataContract]
	public class AdaptivityViewResult : ResultViewData 
	{
		[DataMember]
		public int? NextThemaId { get; set; }

		[DataMember]
		public List<string> NextMaterialPath { get; set; }

		[DataMember]
		public bool NeedToDoPredTest { get; set; }

		[DataMember]
		public bool ShouldWaitBeforeTest { get; set; }

		[DataMember]
		public int? TimeToWait { get; set; }

		[DataMember]
		public bool IsLearningEnded { get; set; }
	}
}