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
    public interface IChatMessageService
    {
        Task<MessageDto> Save(int id, MessageCto message);
        Task DeleteChatMsg(int msgId);
        Task<ChatMessage> GetMessage(int id);
        Task UpdateMsg(ChatMessage msg, string text);
    }
}
