using System;
using System.Runtime.Serialization;
using LMPlatform.Models;

namespace LMPlatform.UI.Services.Modules.Schedule
{
    [DataContract]
    public class ScheduleProtectionPracticalViewData : ScheduleProtectionViewData
    {
        public ScheduleProtectionPracticalViewData(ScheduleProtectionPractical scheduleProtectionPractical) 
            : base(scheduleProtectionPractical.Date, 
                  scheduleProtectionPractical.StartTime, 
                  scheduleProtectionPractical.EndTime,
                  scheduleProtectionPractical.Building,
                  scheduleProtectionPractical.Audience,
                  scheduleProtectionPractical.SubjectId)
        {
            ScheduleProtectionPracticalId = scheduleProtectionPractical.Id;
            GroupId = scheduleProtectionPractical.GroupId;
        } 

        [DataMember]
        public int GroupId { get; set; }


        [DataMember]
        public int ScheduleProtectionPracticalId { get; set; }
    }
}