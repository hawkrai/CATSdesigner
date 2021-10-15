using Entities.Models.History;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.Repositories
{
    public interface IGroupChatHistoryRepository
    {
        Task Add(GroupChatHistory chatHistory);
        Task<GroupChatHistory> GetGroupChatHistoryAsync(int userId, int chatId, bool trackChanges);
    }
}
