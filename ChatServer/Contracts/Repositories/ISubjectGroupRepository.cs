using Entities.Models;
using Entities.Models.GroupChatModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.Repositories
{
    public interface ISubjectGroupRepository
    {
        Task<IEnumerable<SubjectGroup>> GetSubjects(int groupId, bool includeDetachedGroups = false);
        Task<IEnumerable<SubjectGroup>> GetGroups(int subjectId, bool includeDetachedGroups = false);
        Task<IEnumerable<SubjectGroup>> GetGroupsBySubjectIds(IEnumerable<int> subjectIds, bool includeDetachedGroups = false);
    }
}
