using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace LMPlatform.UI.Services.Modules.Concept
{
    [DataContract]
    public class ConceptAvailableModules
    {
        [DataMember]
        public bool Labs { get; set; }

        [DataMember]
        public bool Workshops { get; set; }

        [DataMember]
        public bool Lectures { get; set; }

        [DataMember]
        public bool Tests { get; set; }

    }
}