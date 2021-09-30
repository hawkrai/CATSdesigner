using Contracts.Repositories;
using Entities;
using Entities.CTO;
using Entities.Models;
using Entities.Models.GroupChatModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Repository
{
    public class GroupMessageRepository : RepositoryBase<GroupMessage>, IGroupMessageRepository
    {
        public RepositoryContext _repositoryContext;
        public GroupMessageRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
            _repositoryContext = repositoryContext;
        }
        public async Task Save(GroupMessage msg)
        {
            msg.Time = DateTime.Now;
            await Create(msg);
            await _repositoryContext.SaveChangesAsync();
        }

        public void Remove(GroupMessage msg) => Delete(msg);

        public async Task<GroupMessage> GetGroupMessageAsync(int msgId, bool trackChanges) => await FindByCondition(c => c.Id.Equals(msgId), trackChanges).Include(x=>x.User).SingleOrDefaultAsync();

        public async Task<IEnumerable<GroupMessage>> GetGroupMessagesAsync(int chatId,bool trackChanges) => await FindByCondition(c => c.GroupChatId.Equals(chatId), trackChanges).Include(x=>x.GroupChat).Include(x=>x.User).OrderBy(c => c.Time).ToListAsync();
    }
}
