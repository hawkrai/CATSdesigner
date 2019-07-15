using System.ComponentModel.DataAnnotations.Schema;

namespace LMP.Models
{
    public class OAuthMembership
    {
        public string Provider { get; set; }

        public string ProviderUserId { get; set; }

        public int UserId { get; set; }

        public Membership User { get; set; }
    }
}