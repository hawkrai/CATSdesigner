using System.Runtime.Serialization;

namespace LMPlatform.UI.ViewModels.DocumentsViewModels
{
    [DataContract]
    public class DocumentPreview
    {
        [DataMember]
        public int Id { get; set; }
        [DataMember]
        public string Name { get; set; }
        [DataMember] 
        public int? SubjectId { get; set; }
        [DataMember] 
        public int? ParentId { get; set; }
        [DataMember]
        public int ParentOrder { get; set; }
        [DataMember] 
        public int? UserId { get; set; }
        [DataMember] 
        public int? GroupId { get; set; }
        [DataMember]
        public string Text { get; set; }
        [DataMember]
        public bool IsLocked { get; set; }
    }
}
