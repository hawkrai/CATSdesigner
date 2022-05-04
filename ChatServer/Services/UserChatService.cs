using AutoMapper;
using Contracts;
using Contracts.Services;
using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class UserChatService : IUserChatService
    {
        private readonly IRepositoryManager _repository;
        private readonly IMapper _mapper;

        public UserChatService(IRepositoryManager repository, IMapper mapper)
        {
            _repository = repository;   
            _mapper = mapper;
        }

        public async Task Update(Chat chat)
        {
            _repository.UserChats.Up(chat);
            await _repository.SaveAsync();
        }

        public async Task<Chat> TryGet(string chatName, IEnumerable<User> users)
        {
            var user = users.FirstOrDefault();

            if (user == null)
                return null;

            var chats = (await _repository.UserChats.GetUserChatsAsync(true)).ToList();

            var chatFromDb = chats.FirstOrDefault(c => c.Name == chatName);

            return chatFromDb;
        }


        public async Task Create(Chat chat)
        {
            await _repository.UserChats.Add(chat);
            await _repository.SaveAsync();
        }

        
    }
}
