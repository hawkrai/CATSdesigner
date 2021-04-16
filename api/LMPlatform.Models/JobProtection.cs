using Application.Core.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMPlatform.Models
{
    public class JobProtection : ModelBase
    {
        public int? LabId { get; set; }

        public Labs Lab { get; set; }

        public bool IsReturned { get; set; }

        public bool IsReceived { get; set; }

        public int StudentId { get; set; }

        public Student Student { get; set; }
    }
}
