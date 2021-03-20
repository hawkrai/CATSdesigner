using System.Collections.Generic;
using System.Runtime.Serialization;

namespace LMPlatform.UI.ViewModels.DocumentsViewModels
{
    [DataContract]
    public class DocumentsTree
    {
        [DataMember]
        public int Id { get; set; }
        [DataMember]
        public string Name { get; set; }
        [DataMember]
        public bool IsLocked { get; set; }
        [DataMember] 
        public IEnumerable<DocumentsTree> Children { get; set; }
    }
}
