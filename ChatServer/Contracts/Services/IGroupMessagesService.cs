using AutoMapper;
using Entities.CTO;
using Entities.DTO;
using Entities.Models;
using Entities.Models.GroupChatModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.Services
{
    public interface IGroupMessageService
    {
        Task<MessageDto> Save(int id, GroupMessageCto message);
        Task DeleteGroupMsg(int msgId);
        Task<MessageDto[]> GetGroupMessages(int userId, int chatId, int limit = 20, int offset = 0);
        Task<MessageDto[]> GetChatMessages(int userId, int chatId, int limit = 20, int offset = 0);

        Task<GroupMessage> GetMessage(int id);
        Task UpdateMsg(GroupMessage msg, string text);
    }
}
