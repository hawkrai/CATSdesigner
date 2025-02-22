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
    public class SubjectGroupRepository : RepositoryBase<SubjectGroup>, ISubjectGroupRepository
    {
        public SubjectGroupRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }

        public async Task<IEnumerable<SubjectGroup>> GetSubjects(int groupId) =>
            await FindByCondition(c => c.GroupId == groupId && c.IsActiveOnCurrentGroup == true, false)
            .Where(x => !x.Subject.IsArchive)
            .OrderBy(x => x.Subject.ShortName)
            .ToListAsync();

        public async Task<IEnumerable<SubjectGroup>> GetGroups(int subjectId) => 
            await FindByCondition(c => c.SubjectId == subjectId && c.IsActiveOnCurrentGroup == true, false)
            .Include(x => x.Group)
            .Include(x => x.Subject)
            .Where(x => !x.Subject.IsArchive)
            .OrderBy(x => x.Subject.ShortName)
            .ToListAsync();
    }
}
