using Application.Core.Data;

namespace LMP.Models
{
    public class Attachment : ModelBase
    {
        public string Name { get; set; }

        public string FileName { get; set; }

        public string PathName { get; set; }

        public AttachmentType AttachmentType { get; set; }

        public Message Message { get; set; }

        public int? Message_Id { get; set; }

    }
}