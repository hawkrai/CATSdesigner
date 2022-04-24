using LMPlatform.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace LMPlatform.UI.Services.Modules.Labs
{
    [DataContract]
    public class SubGroupViewData : ResultViewData
    {
        public SubGroupViewData(SubGroup subGroup)
        {
            Id = subGroup.Id;
            Name = subGroup.Name;
            SubjectGroupId = subGroup.SubjectGroupId;
            SubGroupValue = subGroup.Name == "first" ? 1 : subGroup.Name == "second" ? 2 : 3;
        }
        [DataMember]
        public int Id { get; set; }
        [DataMember]

        public string Name { get; set; }
        [DataMember]
        public int SubjectGroupId { get; set; }

        [DataMember]
        public int SubGroupValue { get; set; }
    }
}