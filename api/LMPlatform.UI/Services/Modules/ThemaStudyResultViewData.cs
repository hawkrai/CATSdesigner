using System.Runtime.Serialization;

namespace LMPlatform.UI.Services.Modules
{
	[DataContract]
	public class ThemaStudyResultViewData
	{
		[DataMember]
		public int ThemaId { get; set; }

		[DataMember]
		public string ThemaName { get; set; }

		[DataMember]
		public int Percent { get; set; }
	}
}
