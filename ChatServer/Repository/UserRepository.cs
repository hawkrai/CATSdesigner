using Contracts.Repositories;
using Entities;
using Entities.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Repository
{
    public class UserRepository : RepositoryBase<User>,IUserRepository
    {
        public UserRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }

        public async Task<User> GetUserAsync(int userId, bool trackChanges) =>  await FindByCondition(c => c.UserId.Equals(userId), trackChanges).FirstOrDefaultAsync();

        public async Task<User> GetUserChats(int userId, bool trackChanges)=> await FindByCondition(c => c.UserId.Equals(userId), trackChanges).Include(x => x.UserChats).ThenInclude(x=>x.Messages).Include(x=>x.UserChatHistory).SingleOrDefaultAsync();
        
        public async Task<IEnumerable<User>> GetUsersAsync(bool trackChanges) => await FindAll(trackChanges).OrderBy(c => c.UserId).ToListAsync();
    }
}
