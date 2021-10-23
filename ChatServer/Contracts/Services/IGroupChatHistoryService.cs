using AutoMapper;
using Entities.DTO;
using Entities.Models;
using Entities.Models.History;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.Services
{
    public interface IGroupChatHistoryService
    {
        Task<GroupChatHistory> GetLastRead(int userId, int chatId,bool track=false);
        Task UpdateLastRead(int userId,int chatId);
    }
}
