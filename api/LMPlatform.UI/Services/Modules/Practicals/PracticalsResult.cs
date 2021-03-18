namespace LMPlatform.UI.Services.Modules.Practicals
{
    using LMPlatform.UI.Services.Modules.Schedule;
    using System.Collections.Generic;
    using System.Runtime.Serialization;

    [DataContract]
    public class PracticalsResult : ResultViewData
    {
        [DataMember]
        public List<PracticalsViewData> Practicals { get; set; } 

        [DataMember]
        public List<ScheduleProtectionPracticalViewData> ScheduleProtectionPracticals { get; set; }
    }
}