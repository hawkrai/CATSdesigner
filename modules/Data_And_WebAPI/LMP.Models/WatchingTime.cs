using Application.Core.Data;

namespace LMP.Models
{
    public class WatchingTime : ModelBase
    {
        public WatchingTime()
        {
        }

        public WatchingTime(int userId, int conceptId, int time)
        {
            UserId = userId;
            ConceptId = conceptId;
            Time = time;
        }

        public int UserId { get; set; }

        public int ConceptId { get; set; }

        public int Time { get; set; }
    }
}