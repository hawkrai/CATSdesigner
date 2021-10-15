using Entities.CTO;
using Entities.DTO;
using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatServer.Interfaces
{
    public interface IMessagesService
    {
        MessageDto Save(MessageCto messageDto);
        Task<MessageDto> GetMessage(int msgId, int userId);
//        Task<List<MessageDto>> GetMessages(int chatId, int userId);

    }
}
