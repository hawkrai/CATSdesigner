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
        Task<MessageDto[]> GetGroupMessages(int userId, int chatId, int limit, int offset);
        Task<MessageDto[]> GetChatMessages(int userId, int chatId, int limit, int offset);
        Task<MessageDto[]> SearchGroupMessages(int userId, int chatId, string searchText, int limit, int offset);
        Task<MessageDto[]> SearchChatMessages(int userId, int chatId, string searchText, int limit, int offset);
        Task<GroupMessage> GetMessage(int id);
        Task UpdateMsg(GroupMessage msg, string text);
    }
}
