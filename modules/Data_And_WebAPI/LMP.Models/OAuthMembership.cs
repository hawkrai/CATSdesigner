using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LMP.Models
{
    public class OAuthMembership
    {
        //PROBLEM
        [Key]
        [Column(Order = 0)]
        [StringLength(30)]
        public string Provider { get; set; }

        //PROBLEM
        [Key]
        [Column(Order = 1)]
        [StringLength(100)]
        public string ProviderUserId { get; set; }

        public int UserId { get; set; }

        //PROBLEM
        [Column("UserId")]
        [InverseProperty("OAuthMemberships")]
        public Membership User { get; set; }
    }
}