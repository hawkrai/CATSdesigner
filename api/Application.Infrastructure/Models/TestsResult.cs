using LMPlatform.Models.KnowledgeTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Infrastructure.Models
{
    public class TestsResult
    {
        public List<Test> Tests { get; set; }

        public Dictionary<int, List<TestPassResult>> Results { get; set; }
    }
}
