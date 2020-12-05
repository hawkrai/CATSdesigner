using System.Runtime.Serialization;

namespace LMPlatform.UI.Services.Modules
{
    [DataContract]
    public class MarkViewData
    {
        [DataMember]
        public string Mark { get; set; }

        [DataMember]
        public string Date { get; set; }

        [DataMember]
        public int MarkId { get; set; }

        [DataMember]
        public int LecturesVisitId { get; set; }

        [DataMember]
        public string Comment { get; set; }
    }
}