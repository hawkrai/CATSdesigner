using System.Runtime.Serialization;

namespace LMPlatform.UI.Services.Modules
{
	[DataContract]
	public class AdaptiveTestViewResult : ResultViewData
	{
		[DataMember]
		public int TestId { get; set; }

		[DataMember]
		public string Title { get; set; }
	}
}
