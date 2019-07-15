namespace LMP.Models
{
    public class UsersInRoles
    {
        public int UserId { get; set; }

        public int RoleId { get; set; }

        public Role Role { get; set; }

        public Membership User { get; set; }
    }
}