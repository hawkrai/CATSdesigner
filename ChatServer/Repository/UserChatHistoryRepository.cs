using Contracts.Repositories;
using Entities;
using Entities.Models;
using Entities.Models.History;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Repository
{
    public class UserChatHistoryRepository : RepositoryBase<UserChatHistory>, IUserChatHistoryRepository
    {
        public UserChatHistoryRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }

        public async Task Add(UserChatHistory chatHistory)
        {
            await Create(chatHistory);
        }

        public async Task<UserChatHistory> GetUserChatHistoryAsync(int userId,int chatId, bool trackChanges) =>  await FindByCondition(c => c.UserId==userId && c.ChatId==chatId, trackChanges).FirstOrDefaultAsync();

    }
}
