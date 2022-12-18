using System.Collections.Generic;
using Application.Core.Data;

namespace Application.Infrastructure.CTO
{
    public class CourseProjectPercentageResult
    {
        public PagedList<StudentData> Students { get; set; }

        public List<PercentageGraphData> PercentageGraphs { get; set; }
    }
}
