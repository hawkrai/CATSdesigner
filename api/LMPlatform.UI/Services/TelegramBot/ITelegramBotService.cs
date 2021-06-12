using LMPlatform.UI.Services.Modules.News;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace LMPlatform.UI.Services.TelegramBot
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "ITelegramBotService" in both code and config file together.
    [ServiceContract]
    public interface ITelegramBotService
    {
        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "/GetUserNews?fio={fio}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        NewsResult GetUserNewsByFIO(string fio);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "/GetNewsByGroupName/{groupName}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        NewsResult GetNewsByGroupName(string groupName);
    }
}
