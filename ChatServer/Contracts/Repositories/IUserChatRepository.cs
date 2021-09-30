using Entities.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.Repositories
{
    public interface IUserChatRepository
    {
        void Up(Chat chat);
        Task Add(Chat chat);
        Task<IEnumerable<Chat>> GetUserChatsAsync(bool trackChanges);
        Task<Chat> GetUserChatAsync(int chatId, bool trackChanges);
        Task<Chat> GetChatUsers(int chatId);

    }
}
