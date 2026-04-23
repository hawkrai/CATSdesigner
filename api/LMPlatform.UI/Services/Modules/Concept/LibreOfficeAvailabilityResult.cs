using System.Runtime.Serialization;

namespace LMPlatform.UI.Services.Modules.Concept
{
    [DataContract]
    public class LibreOfficeAvailabilityResult : ResultViewData
    {
        [DataMember]
        public bool IsLibreOfficeAvailable { get; set; }
    }
}
