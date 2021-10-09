using Entities.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.Repositories
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetUsersAsync(bool trackChanges);
        Task<User> GetUserAsync(int userId, bool trackChanges);
        Task<User> GetUserChats(int userId, bool trackChanges);
    }
}
