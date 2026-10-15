using System.Runtime.Serialization;

namespace LMPlatform.UI.Services.Modules.Concept
{
    [DataContract]
    public class EumkExportOptionsResult : ResultViewData
    {
        [DataMember]
        public bool IsDocxExportAvailable { get; set; }
    }
}
