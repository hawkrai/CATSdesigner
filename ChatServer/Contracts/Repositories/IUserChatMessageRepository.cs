using Entities.CTO;
using Entities.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.Repositories
{
    public interface IUserChatMessageRepository
    {
        Task<IEnumerable<ChatMessage>> GetUserChatMessagesAsync(int chatId, bool trackChanges, int limit = 20, int offset = 0);
        Task<ChatMessage> GetUserChatMessageAsync(int msgId, bool trackChanges);
        public Task Save(ChatMessage msg);
        void Remove(ChatMessage msg);

    }
}
