namespace LMPlatform.UI.Services.Modules.Schedule
{
    using System.Runtime.Serialization;

    using LMPlatform.Models;

    [DataContract]
    public class ScheduleProtectionLabsViewData : ScheduleProtectionViewData
    {
        public ScheduleProtectionLabsViewData(ScheduleProtectionLabs scheduleProtectionLabs)
            : base(scheduleProtectionLabs.Date,
                  scheduleProtectionLabs.StartTime,
                  scheduleProtectionLabs.EndTime,
                  scheduleProtectionLabs.Building,
                  scheduleProtectionLabs.Audience,
                  scheduleProtectionLabs.SubjectId)
        {
            ScheduleProtectionLabId = scheduleProtectionLabs.Id;
            SubGroupId = scheduleProtectionLabs.SuGroupId;
        }

        [DataMember]
        public int ScheduleProtectionLabId { get; set; }

        [DataMember]
        public int SubGroupId { get; set; }

		[DataMember]
		public int SubGroup { get; set; }


    }
}