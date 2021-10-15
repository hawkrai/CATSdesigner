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
    public class GroupChatHistoryService : IGroupChatHistoryService
    {
        private readonly IRepositoryManager _repository;
        private readonly IMapper _mapper;

        public GroupChatHistoryService(IRepositoryManager repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task Create(GroupChatHistory chatHistory)
        {
            await _repository.GroupChatHistoryRepository.Add(chatHistory);
            await _repository.SaveAsync();
        }


        public async Task<GroupChatHistory> GetLastRead(int userId, int chatId, bool track = false)
        {
            return await _repository.GroupChatHistoryRepository.GetGroupChatHistoryAsync(userId, chatId, track);
        }

        public async Task UpdateLastRead(int userId, int chatId)
        {
            var userH= await _repository.GroupChatHistoryRepository.GetGroupChatHistoryAsync(userId, chatId, true);
            userH.Date = DateTime.Now;
            await _repository.SaveAsync();
        }
    }
}
