using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using Application.Core.Helpers;
using Application.Core.UI.Controllers;
using Application.Infrastructure.MessageManagement;
using Application.Infrastructure.UserManagement;
using LMPlatform.Models;
using LMPlatform.UI.Attributes;
using LMPlatform.UI.ViewModels.MessageViewModels;
using WebMatrix.WebData;

namespace LMPlatform.UI.Controllers
{
    [JwtAuth]
    public class MessageController : BasicController
    {
        public IUsersManagementService UsersManagementService => this.ApplicationService<IUsersManagementService>();

        public IMessageManagementService MessageManagementService =>
            this.ApplicationService<IMessageManagementService>();

        //[HttpPost]
        //public ActionResult WriteMessage(MessageViewModel msg, string itemAttachments)
        //{
        //    var jsonSerializer = new JavaScriptSerializer();
        //    var attachments = jsonSerializer.Deserialize<List<Attachment>>(itemAttachments);

        //    msg.Attachment = attachments;

        //    if (this.ModelState.IsValid && msg.FromId == UserContext.CurrentUserId) msg.SaveMessage();

        //    return StatusCode(HttpStatusCode.OK);
        //}

        [HttpPost]
        public ActionResult WriteMessage(MessageViewModel msg, string itemAttachments)
        {
            if (this.ModelState.IsValid && msg.FromId == UserContext.CurrentUserId)  
            {
                try
                {
                    var jsonSerializer = new JavaScriptSerializer();
                    var attachments = jsonSerializer.Deserialize<List<Attachment>>(itemAttachments);

                    msg.Attachment = attachments;

                    msg.SaveMessage();
                    return this.Json(new {code = 200, resultMessage = "Сообщение отправлено"});
                }
                catch
                {
                    return this.Json(new {code = 500, resultMessage = "При сохранении сообщения произошла ошибка"});
                }
            }

            msg.Attachment = new List<Attachment>();

            return JsonResponse(msg);
        }

        public int MessagesCount()
        {
            var messagesCount = this.MessageManagementService.GetUnreadUserMessages(UserContext.CurrentUserId).Count();
            return messagesCount;
        }

        public JsonResult GetSelectListOptions(string term)
        {
            var recip = this.MessageManagementService.GetRecipients(UserContext.CurrentUserId);

            var result = recip.Where(r => r.FullName.ToLower().Contains(term.ToLower()))
                .Select(r => new
                {
                    text = r.FullName,
                    value = r.Id.ToString()
                }).ToList();

            return this.Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}