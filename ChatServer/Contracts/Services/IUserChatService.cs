using Entities.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Contracts.Services
{
    public interface IUserChatService
    {
        Task Create(Chat chat);
        Task Update(Chat chat);
        Task<Chat> TryGet(string chat, IEnumerable<User> users);
    }
}
