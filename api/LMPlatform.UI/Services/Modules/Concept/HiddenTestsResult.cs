using System.Collections.Generic;
using System.Runtime.Serialization;

namespace LMPlatform.UI.Services.Modules.Concept
{
    [DataContract]
    public class HiddenTestsResult
    {
        [DataMember]
        public List<int> ConceptIds { get; set; }

        [DataMember]
        public List<int> TestIds { get; set; }

        [DataMember]
        public string Message { get; set; }

        [DataMember]
        public string Code { get; set; }
    }
}



