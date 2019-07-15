using LMP.Models.From_App_Core_Data;

namespace LMP.Models.From_LMP_Models
{
    public class Lectures : ModelBase
    {
        public string Theme { get; set; }

        public int Duration { get; set; }

        public int SubjectId { get; set; }

        public int Order { get; set; }

        public string Attachments { get; set; }

        public Subject Subject { get; set; }
    }
}