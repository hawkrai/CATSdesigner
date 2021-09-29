using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Entities.Models
{
    public class Student
    {
        [Key]
        public int UserId { get; set; }
        
        public string Email { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string MiddleName { get; set; }

        public bool? Confirmed { get; set; }

        public int GroupId { get; set; }


        [NotMapped]
        public string FullName => $"{LastName} {FirstName} {MiddleName}";
    }

}
