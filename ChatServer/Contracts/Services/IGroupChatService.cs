using Entities.DTO;
using Entities.Models.GroupChatModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.Services
{
    public interface IGroupChatService
    {
        Task<IEnumerable<SubjectChatsDto>> GetGroups(int userId, bool isLector);
    }
}
