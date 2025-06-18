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
        Task<IEnumerable<ChatMessage>> GetUserChatMessagesAsync(int chatId, bool trackChanges, int limit, int offset);
        Task<IEnumerable<ChatMessage>> GetUserChatMessagesAsync(List<int> chatIds, bool trackChanges);
        Task<IEnumerable<ChatMessage>> SearchUserChatMessagesAsync(int chatId, string searchText, bool trackChanges, int limit, int offset);
        Task<ChatMessage> GetUserChatMessageAsync(int msgId, bool trackChanges);
        public Task Save(ChatMessage msg);
        void Remove(ChatMessage msg);

    }
}
