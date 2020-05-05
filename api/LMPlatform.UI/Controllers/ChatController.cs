using System;
using System.Web.Mvc;
using Application.Core.UI.Controllers;
using LMPlatform.UI.Attributes;

namespace LMPlatform.UI.Controllers
{
    public class ChatController : BasicController
    {
        public static bool EnabledChat { get; set; }

        [JwtAuth(Roles = "admin")]
        [HttpPost]
        public JsonResult EnablChat(string Switcher)
        {
            EnabledChat = Convert.ToBoolean(Switcher);
            return this.Json(!EnabledChat ? new {resultMessage = "Чат отключен"} : new {resultMessage = "Чат включен"});
        }
    }
}