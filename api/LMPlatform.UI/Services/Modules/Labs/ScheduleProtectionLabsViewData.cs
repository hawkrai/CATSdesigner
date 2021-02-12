namespace LMPlatform.UI.Services.Modules.Labs
{
    using System.Runtime.Serialization;

    using LMPlatform.Models;

    [DataContract]
    public class ScheduleProtectionLabsViewData
    {
        public ScheduleProtectionLabsViewData(ScheduleProtectionLabs scheduleProtectionLabs)
        {
            ScheduleProtectionLabId = scheduleProtectionLabs.Id;
            SubGroupId = scheduleProtectionLabs.SuGroupId;
            Date = scheduleProtectionLabs.Date.ToString("dd.MM.yyyy");
            StartTime = scheduleProtectionLabs.StartTime?.ToString(@"HH\:mm");
            EndTime = scheduleProtectionLabs.EndTime?.ToString(@"HH\:mm");
            Building = scheduleProtectionLabs.Building;
            Audience = scheduleProtectionLabs.Audience;
        }

        [DataMember]
        public int ScheduleProtectionLabId { get; set; }

        [DataMember]
        public int SubGroupId { get; set; }

		[DataMember]
		public int SubGroup { get; set; }

        [DataMember]
        public string Date { get; set; }
        [DataMember]
        public string StartTime { get; set; }
        [DataMember]
        public string EndTime { get; set; }
        [DataMember]
        public string Building { get; set; }
        [DataMember]
        public string Audience { get; set; }
    }
}