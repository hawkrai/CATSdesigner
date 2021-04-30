using LMPlatform.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Infrastructure.Models
{
    public class StudentJobProtection
    {
        public int? LabId { get; set; }
        public int StudentId { get; set; }
        public bool IsReturned { get; set; }
        public bool IsReceived { get; set; }

        public Labs Lab { get; set; }

        public SubjectStudent Student { get; set; }

    }
}
