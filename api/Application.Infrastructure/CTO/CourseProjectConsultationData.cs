using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Core.Data;

namespace Application.Infrastructure.CTO
{
    public class CourseProjectConsultationData
    {
        public PagedList<StudentData> Students { get; set; }

        public List<CourseProjectConsultationDateData> Consultations { get; set; }
    }
}
