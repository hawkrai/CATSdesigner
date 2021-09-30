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
        Task<IEnumerable<SubjectGroup>> GetSubjects(int groupId);
    }
}
