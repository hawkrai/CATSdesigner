using System;
using System.Collections.Generic;

namespace LMPlatform.UI.ViewModels.AdministrationViewModels
{
    public class AttendanceViewModel
    {
        public string FullName { get; set; }

        public IEnumerable<String> Logins { get; set; }
    }
}