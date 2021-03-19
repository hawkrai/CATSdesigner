using Application.Core.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMPlatform.Models
{
    public class ScheduleProtectionMarkBase : ModelBase
    {

        public string Comment { get; set; }

        public string Mark { get; set; }


        public bool ShowForStudent { get; set; }

        public ScheduleProtectionMarkBase() { }

        public ScheduleProtectionMarkBase(int id, string comment, string mark, bool showForStudent)
        {
            Id = id;
            Comment = comment;
            Mark = mark;
            ShowForStudent = showForStudent;
        }
    }
}
