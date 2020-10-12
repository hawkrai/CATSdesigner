namespace LMPlatform.UI.ViewModels.DocumentsViewModels
{
    public class DocumentPreview
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int? SubjectId { get; set; }
        public int? ParentId { get; set; }
        public int ParentOrder { get; set; }
        public int? UserId { get; set; }
        public int? GroupId { get; set; }
        public string Text { get; set; }
    }
}
