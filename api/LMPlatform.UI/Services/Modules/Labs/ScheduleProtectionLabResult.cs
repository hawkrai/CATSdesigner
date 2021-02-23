namespace LMPlatform.UI.Services.Modules.Labs
{
    using LMPlatform.UI.Services.Modules.Schedule;
    using System.Collections.Generic;
	using System.Runtime.Serialization;

	[DataContract]
	public class ScheduleProtectionLabResult : ResultViewData
	{
		[DataMember]
		public List<ScheduleProtectionLesson> ScheduleProtectionLabRecomended { get; set; } 
	}
}