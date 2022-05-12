using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Application.Infrastructure.Models;

namespace LMPlatform.UI.Services.Modules.Schedule
{
    public class ScheduleBusyException : Exception
    {
        public List<ScheduleModel> Schedule { get; set; }
    }
}