using Contracts.Repositories;
using Entities;
using Entities.Models;
using Entities.Models.GroupChatModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Diagnostics;
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
            await FindByCondition(c => c.SubjectId == subjId, false)
            .Include(x=>x.GroupMessages)
            .Include(x=>x.GroupChatHistory)
            .Include(x=> x.Subject)
            .OrderBy(x=>x.GroupName)
            .ToListAsync();

        public async Task<IEnumerable<GroupChat>> GetForStudents(int groupId, int subjId) => 
            await FindByCondition(c => (c.GroupId == null || c.GroupId == groupId) && c.SubjectId == subjId, false)
            .Include(x => x.GroupMessages)
            .Include(x=>x.GroupChatHistory)
            .Include(x=>x.Subject)
            .OrderBy(x=>x.GroupName)
            .ToListAsync();

        public async Task<bool> SubjectChatExists(int subjectId)
        {
            return await FindByCondition(c => c.SubjectId == subjectId && c.IsSubjectGroup, false).AnyAsync();
        }

        public async Task<bool> CreateChat(GroupChat chat)
        {
            try
            {
                await Create(chat);
                await RepositoryContext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Create chat exception: " + ex.Message, ex);
                return false;
            }
        }

        public async Task<bool> GroupChatExists(int subjectId, int? groupId)
        {
            return await FindByCondition(c => c.SubjectId == subjectId && c.GroupId == groupId && !c.IsSubjectGroup, false).AnyAsync();
        }
    }
}
