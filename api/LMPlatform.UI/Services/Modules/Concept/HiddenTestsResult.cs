using System.Collections.Generic;
using System.Runtime.Serialization;

namespace LMPlatform.UI.Services.Modules.Concept
{
    [DataContract]
    public class HiddenTestsResult : ResultViewData
    {
        [DataMember]
        public List<int> ConceptIds { get; set; }

        [DataMember]
        public List<int> TestIds { get; set; }
    }
}



