using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using LMP.Models.Interface;

namespace LMP.Models
{
    public class Role : ModelBase
    {
        public Role()
        {
            Members = new List<UsersInRoles>();
        }

        public string RoleName { get; set; }

        public string RoleDisplayName { get; set; }

        public ICollection<UsersInRoles> Members { get; set; }
    }
}