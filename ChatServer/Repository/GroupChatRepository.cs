using Contracts.Repositories;
using Entities;
using Entities.Models;
using Entities.Models.GroupChatModels;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Repository
{
    public class GroupChatRepository : RepositoryBase<GroupChat>, IGroupChatRepository
    {
        public GroupChatRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }

        public async Task<int?> GetGroupId(int chatId) =>
            await FindByCondition(c => c.Id == chatId, false).Select(_=>_.GroupId).FirstOrDefaultAsync();


        public async Task<IEnumerable<GroupChat>> GetForLecturer(int subjId) => 
            await FindByCondition(c => c.SubjectId == subjId, false).Include(x=>x.GroupMessages).Include(x=>x.GroupChatHistory).ToListAsync();

        public async Task<IEnumerable<GroupChat>> GetForStudents(int groupId, int subjId) 
            => await FindByCondition(c => (c.GroupId == null || c.GroupId == groupId) && c.SubjectId == subjId, false).Include(x => x.GroupMessages).Include(x=>x.GroupChatHistory).ToListAsync();

    }
}
