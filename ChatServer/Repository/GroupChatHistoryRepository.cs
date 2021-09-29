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
    public class GroupChatHistoryRepository : RepositoryBase<GroupChatHistory>, IGroupChatHistoryRepository
    {
        public GroupChatHistoryRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }

        public async Task Add(GroupChatHistory chatHistory)
        {
            await Create(chatHistory);
        }

        public async Task<GroupChatHistory> GetGroupChatHistoryAsync(int userId,int chatId, bool trackChanges) =>  await FindByCondition(c => c.UserId==userId && c.GroupChatId==chatId, trackChanges).FirstOrDefaultAsync();

    }
}
