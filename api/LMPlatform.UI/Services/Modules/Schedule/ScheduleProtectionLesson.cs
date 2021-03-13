namespace LMPlatform.UI.Services.Modules.Schedule
{
    using System.Runtime.Serialization;

    [DataContract]
    public class ScheduleProtectionLesson
    {
        [DataMember]
        public int ScheduleProtectionId { get; set; }

        [DataMember]
        public string Mark { get; set; }
    }
}