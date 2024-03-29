﻿using Application.Core;
using Application.Infrastructure.NewsManagement;
using LMPlatform.UI.Attributes;
using LMPlatform.UI.Services.Modules.News;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Web.Http;

namespace LMPlatform.UI.Services.TelegramBot
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "TelegramBotService" in code, svc and config file together.
    // NOTE: In order to launch WCF Test Client for testing this service, please select TelegramBotService.svc or TelegramBotService.svc.cs at the Solution Explorer and start debugging.
    public class TelegramBotService : ITelegramBotService
    {
        private readonly LazyDependency<INewsManagementService> newsManagementService = new LazyDependency<INewsManagementService>();
        public INewsManagementService NewsManagementService => newsManagementService.Value;

        [AllowAnonymous]
        public TelegramNewsResult GetNewsByGroupName(string groupName)
        {
            var groupNews = NewsManagementService.GetNewsForTelgeramByGroupName(groupName);
            return new TelegramNewsResult
            {
                News = groupNews.Select(x => new TelegramNewsViewModel(x)).ToList(),
            };
        }
        [AllowAnonymous]
        public TelegramNewsResult GetUserNewsByFIO(string fio)
        {
            var userNews = NewsManagementService.GetUserNewsByFIO(fio);
            return new TelegramNewsResult
            {
                News = userNews.Select(x => new TelegramNewsViewModel(x)).ToList(),
            };
        }
    }
}
