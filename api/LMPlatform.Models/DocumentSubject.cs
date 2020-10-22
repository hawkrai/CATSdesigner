
namespace LMPlatform.Models
{
    public class DocumentSubject
    {
        public int DocumentId { get; set; }
        public Documents Document { get; set; }
        public int SubjectId { get; set; }
        public Subject Subject { get; set; }
    }
}
