using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using LMP.Data.Infrastructure;
using LMP.Models.From_App_Core_Data;

namespace LMP.Models.From_LMP_Models
{
    public class Role : ModelBase
    {
        public Role()
        {
            Members = new List<UsersInRoles>();
        }

        //PROBLEM
        [StringLength(256)] public string RoleName { get; set; }

        //PROBLEM
        [StringLength(256)] public string RoleDisplayName { get; set; }

        public ICollection<UsersInRoles> Members { get; set; }
    }
}