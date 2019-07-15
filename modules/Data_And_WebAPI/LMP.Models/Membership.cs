using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using LMP.Models.Interface;

namespace LMP.Models
{
    public class Membership : ModelBase
    {
        public Membership()
        {
            Roles = new List<UsersInRoles>();
            OAuthMemberships = new List<OAuthMembership>();
        }

        public DateTime? CreateDate { get; set; }

        //PROBLEM
        [StringLength(128)] public string ConfirmationToken { get; set; }

        public bool? IsConfirmed { get; set; }

        public DateTime? LastPasswordFailureDate { get; set; }

        public int PasswordFailuresSinceLastSuccess { get; set; }

        //PROBLEM
        [Required] [StringLength(128)] public string Password { get; set; }

        public DateTime? PasswordChangedDate { get; set; }

        //PROBLEM
        [Required] [StringLength(128)] public string PasswordSalt { get; set; }

        //PROBLEM
        [StringLength(128)] public string PasswordVerificationToken { get; set; }

        public DateTime? PasswordVerificationTokenExpirationDate { get; set; }

        public ICollection<UsersInRoles> Roles { get; set; }

        public User User { get; set; }

        //PROBLEM
        [ForeignKey("UserId")] public ICollection<OAuthMembership> OAuthMemberships { get; set; }
    }
}