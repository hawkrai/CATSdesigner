namespace ChatServer.Models
{
    public class ParticipantState
    {
        public int UserId { get; set; }
        public bool IsMicOn { get; set; } = true;
        public bool IsCameraOn { get; set; } = false;
    }
}