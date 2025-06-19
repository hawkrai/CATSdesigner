using System.Collections.Concurrent;

namespace ChatServer.Models
{
    public class GroupCallInfo
    {
        public string OwnerConnectionId { get; set; }
        public int OwnerUserId { get; set; }
        public ConcurrentDictionary<string, ParticipantState> Participants { get; set; } = new ConcurrentDictionary<string, ParticipantState>();
    }
}