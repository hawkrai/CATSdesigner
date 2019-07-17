using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LMP.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionsManagementController : ControllerBase
    {
        // GET: api/QuestionsManagement
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/QuestionsManagement/5
        [HttpGet("{id}", Name = "Get")]
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/QuestionsManagement
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT: api/QuestionsManagement/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
