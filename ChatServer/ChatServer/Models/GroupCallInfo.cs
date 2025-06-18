using System.Collections.Generic;

namespace ChatServer.Models
{
    public class GroupCallInfo
    {
        public string OwnerConnectionId { get; set; }
        public HashSet<string> Participants { get; set; } = new HashSet<string>();
    }
}
