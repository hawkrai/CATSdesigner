using Entities.Models.History;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.Repositories
{
    public interface IUserChatHistoryRepository
    {
        Task Add(UserChatHistory chatHistory);
        Task<UserChatHistory> GetUserChatHistoryAsync(int userId, int chatId, bool trackChanges);
    }
}
