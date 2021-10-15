using Entities.Models;
using Entities.Models.GroupChatModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.Repositories
{
    public interface IGroupChatRepository
    {
        Task<IEnumerable<GroupChat>> GetForLecturer(int subjId);
        Task<IEnumerable<GroupChat>> GetForStudents(int groupId, int subjId);
        Task<int?> GetGroupId(int chatId);
    }
}
