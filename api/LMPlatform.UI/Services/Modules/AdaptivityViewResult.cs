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
		public bool NeedToSelectAdaptivityType { get; set; }

		[DataMember]
		public bool NeedToDoPredTest { get; set; }
	}
}