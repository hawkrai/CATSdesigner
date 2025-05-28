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

        public async Task<IEnumerable<SubjectGroup>> GetSubjects(int groupId, bool includeDetachedGroups = false) =>
            await FindByCondition(c => c.GroupId == groupId && ((c.IsActiveOnCurrentGroup == true && !includeDetachedGroups) || (includeDetachedGroups)), false)
            .Where(x => !x.Subject.IsArchive)
            .OrderBy(x => x.Subject.ShortName)
            .ToListAsync();

        public async Task<IEnumerable<SubjectGroup>> GetGroups(int subjectId, bool includeDetachedGroups = false) => 
            await FindByCondition(c => c.SubjectId == subjectId && ((c.IsActiveOnCurrentGroup == true && !includeDetachedGroups) || (includeDetachedGroups)), false)
            .Include(x => x.Group)
            .Include(x => x.Subject)
            .Where(x => !x.Subject.IsArchive)
            .OrderBy(x => x.Subject.ShortName)
            .ToListAsync();

        public async Task<IEnumerable<SubjectGroup>> GetGroupsBySubjectIds(IEnumerable<int> subjectIds, bool includeDetachedGroups = false) =>
             await FindByCondition(sg => subjectIds.Contains(sg.SubjectId) && ((sg.IsActiveOnCurrentGroup == true && !includeDetachedGroups) || (includeDetachedGroups)), false)
            .Include(sg => sg.Group)
            .Include(sg => sg.Subject)
            .Where(sg => !sg.Subject.IsArchive)
            .ToListAsync();
    }
}
