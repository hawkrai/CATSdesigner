using Entities.Models;
using Entities.Models.GroupChatModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.Repositories
{
    public interface IGroupMessageRepository
    {
        public Task Save(GroupMessage msg);
        Task<IEnumerable<GroupMessage>> GetGroupMessagesAsync(int chatId, bool trackChanges);
        Task<GroupMessage> GetGroupMessageAsync(int msgId, bool trackChanges);
        void Remove(GroupMessage msg);
    }
}
