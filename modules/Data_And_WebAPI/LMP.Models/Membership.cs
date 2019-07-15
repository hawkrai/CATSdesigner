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

        public string ConfirmationToken { get; set; }

        public bool? IsConfirmed { get; set; }

        public DateTime? LastPasswordFailureDate { get; set; }

        public int PasswordFailuresSinceLastSuccess { get; set; }

        public string Password { get; set; }

        public DateTime? PasswordChangedDate { get; set; }

        public string PasswordSalt { get; set; }

        public string PasswordVerificationToken { get; set; }

        public DateTime? PasswordVerificationTokenExpirationDate { get; set; }

        public ICollection<UsersInRoles> Roles { get; set; }

        public User User { get; set; }

        public ICollection<OAuthMembership> OAuthMemberships { get; set; }
    }
}