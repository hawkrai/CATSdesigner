using Application.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace LMPlatform.UI.Services.Modules.Labs
{
    [DataContract]
    public class HasGroupJobProtectionViewData : HasJobProtectionViewData
    {
        public HasGroupJobProtectionViewData(GroupJobProtection groupJobProtection)
        {
            GroupId = groupJobProtection.GroupId;
            HasJobProtection = groupJobProtection.HasJobProtection;
        }
        [DataMember]
        public int GroupId { get; set; }

    }
}