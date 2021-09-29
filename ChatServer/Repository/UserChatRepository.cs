using Contracts.Repositories;
using Entities;
using Entities.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Repository
{
    public class UserChatRepository : RepositoryBase<Chat>,IUserChatRepository
    {
        public UserChatRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }

        public void Up(Chat chat)
        {
            Update(chat);
        }


        public async Task Add(Chat chat)
        {
            await Create(chat);
        }

        public async Task<Chat> GetChatUsers(int chatId) => await FindByCondition(c => c.Id.Equals(chatId), false).Include(c=>c.Users).SingleOrDefaultAsync();
        
        public async Task<Chat> GetUserChatAsync(int userChatId, bool trackChanges) => await FindByCondition(c => c.Id.Equals(userChatId), trackChanges).SingleOrDefaultAsync();

        public async Task<IEnumerable<Chat>> GetUserChatsAsync(bool trackChanges) => await FindAll(trackChanges).OrderBy(c => c.Id).ToListAsync();
    }
}
