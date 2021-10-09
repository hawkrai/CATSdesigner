using Contracts.Repositories;
using Entities;
using Entities.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Repository
{
    public class UserChatMessageRepository : RepositoryBase<ChatMessage>,IUserChatMessageRepository
    {
        public UserChatMessageRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }

        public async Task Save(ChatMessage msg)
        {
            await Create(msg);
            await RepositoryContext.SaveChangesAsync();
        }

        public void Remove(ChatMessage msg) => Delete(msg);


        public async Task<ChatMessage> GetUserChatMessageAsync(int msgId, bool trackChanges) 
            => await FindByCondition(c => c.Id.Equals(msgId), trackChanges).Include(x=>x.User).SingleOrDefaultAsync();

        public async Task<IEnumerable<ChatMessage>> GetUserChatMessagesAsync(int chatId,bool trackChanges) 
            => await FindByCondition(c => c.ChatId.Equals(chatId), trackChanges).Include(x=>x.User).OrderBy(c => c.Time).ToListAsync();
    }
}
