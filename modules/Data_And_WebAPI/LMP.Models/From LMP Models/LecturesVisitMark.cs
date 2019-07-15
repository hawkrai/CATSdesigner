using LMP.Models.From_App_Core_Data;

namespace LMP.Models.From_LMP_Models
{
    public class LecturesVisitMark : ModelBase
    {
        public int StudentId { get; set; }

        public string Mark { get; set; }

        public int LecturesScheduleVisitingId { get; set; }

        public Student Student { get; set; }

        public LecturesScheduleVisiting LecturesScheduleVisiting { get; set; }
    }
}