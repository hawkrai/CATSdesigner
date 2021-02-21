namespace LMPlatform.UI.Services.Modules.Labs
{
    using LMPlatform.UI.Services.Modules.Schedule;
    using System.Collections.Generic;
    using System.Runtime.Serialization;

    [DataContract]
    public class LabsResult : ResultViewData
    {
        [DataMember]
        public List<LabsViewData> Labs { get; set; }

		[DataMember]
		public List<ScheduleProtectionLabsViewData> ScheduleProtectionLabs { get; set; } 
    }
}