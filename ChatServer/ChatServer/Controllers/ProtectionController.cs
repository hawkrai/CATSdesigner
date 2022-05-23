using System.Threading.Tasks;
using ChatServer.Hubs;
using Entities.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace ChatServer.Controllers
{
    [Route("ProtectionApi/[controller]")]
    [ApiController]
    public class ProtectionController : ControllerBase
    {
        private readonly IHubContext<NotificationHub> _notificationHub;
        public ProtectionController(IHubContext<NotificationHub> notificationHub)
        {
            _notificationHub = notificationHub;
        }
        [HttpPost("Changed")]
        public async Task<ActionResult> ProtectionChanged([FromBody] ProtectionChangedDto protectionChanged)
        {
            await _notificationHub.Clients.All.SendAsync("ProtectionChanged", protectionChanged);
            return Ok();
        }
    }
}
