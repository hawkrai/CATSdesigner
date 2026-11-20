using System.Collections.Generic;
using System.Runtime.Serialization;

namespace LMPlatform.UI.Services.Modules
{
	[DataContract]
	public class ThemaStudyResultsViewResult : ResultViewData
	{
		[DataMember]
		public List<ThemaStudyResultViewData> Themas { get; set; }
	}
}
