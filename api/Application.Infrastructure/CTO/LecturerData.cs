using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LMPlatform.Models;

namespace Application.Infrastructure.CTO
{
    public class LecturerData
    {
        public int LectorId { get; set; }

        public string FullName { get; set; }

        public LecturerData(Lecturer lecturer)
        {

            if (lecturer != null)
            {
                LectorId = lecturer.Id;
                FullName = lecturer.FullName;
            }
        }
    }
}
