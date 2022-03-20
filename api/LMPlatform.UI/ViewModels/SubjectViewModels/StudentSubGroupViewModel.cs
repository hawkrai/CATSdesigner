using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LMPlatform.UI.ViewModels.SubjectViewModels
{
    public class StudentSubGroupViewModel
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public int Id { get; set; } 

        public string MiddleName { get; set; }

        public bool Selected { get; set; }
    }
}