using LMPlatform.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LMPlatform.UI.ViewModels.SubjectViewModels
{
    public class LectorViewModel
    {
        public int Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string MiddleName { get; set; }

        public LectorViewModel(Lecturer lecturer)
        {
            Id = lecturer.Id;
            FirstName = lecturer.FirstName;
            LastName = lecturer.LastName;
            MiddleName = lecturer.MiddleName;
        }

    }
}