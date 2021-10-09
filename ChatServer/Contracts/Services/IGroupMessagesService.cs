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
        Task<MessageDto[]> GetGroupMsg(int userId, int chatId);
        Task<MessageDto[]> GetChatMsgs(int userId, int chatId);

        Task<GroupMessage> GetMessage(int id);
        Task UpdateMsg(GroupMessage msg, string text);
    }
}
