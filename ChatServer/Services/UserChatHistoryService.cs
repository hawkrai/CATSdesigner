using AutoMapper;
using Contracts;
using Contracts.Services;
using Entities.DTO;
using Entities.Models;
using Entities.Models.History;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class UserChatHistoryService : IUserChatHistoryService
    {
        private readonly IRepositoryManager _repository;
        private readonly IMapper _mapper;

        public UserChatHistoryService(IRepositoryManager repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task Create(UserChatHistory chatHistory)
        {
            await _repository.UserChatHistoryRepository.Add(chatHistory);
            await _repository.SaveAsync();
        }


        public async Task<UserChatHistory> GetLastRead(int userId, int chatId, bool track = false)
        {
            return await _repository.UserChatHistoryRepository.GetUserChatHistoryAsync(userId, chatId, track);
        }

        public async Task UpdateLastRead(int userId, int chatId)
        {
            var userH= await _repository.UserChatHistoryRepository.GetUserChatHistoryAsync(userId, chatId, true);
            userH.Date = DateTime.Now;
            await _repository.SaveAsync();
        }
    }
}
