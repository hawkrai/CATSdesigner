using AutoMapper;
using ChatServer.services;
using Contracts;
using Contracts.Services;
using Entities.DTO;
using Entities.Models;
using Entities.Models.GroupChatModels;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatServer.Controllers
{
    [Route("ChatApi/[controller]/[action]")]
    [ApiController]
    public class MessageController : Controller
    {
        private readonly IMapper _mapper;
        private readonly IGroupMessageService _groupMessageService;

        public MessageController(IGroupMessageService groupMessageService, IMapper mapper)
        {
            _groupMessageService = groupMessageService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IEnumerable<MessageDto>> GetGroupMsgs(int userId, int chatId, int limit = 20, int offset = 0)
        {
            var msgs = await _groupMessageService.GetGroupMessages(userId, chatId, limit, offset);
            return msgs;
        }

        [HttpGet]
        public async Task<IEnumerable<MessageDto>> GetChatMsgs(int userId, int chatId, int limit = 20, int offset = 0)
        {
            var msgs = await _groupMessageService.GetChatMessages(userId, chatId, limit, offset);
            return msgs;
        }

        [HttpGet]
        public async Task<IEnumerable<MessageDto>> SearchMessages(
            int userId,
            int chatId,
            bool isGroupChat,
            string searchText,
            int limit = 20,
            int offset = 0)
        {
            if (string.IsNullOrWhiteSpace(searchText))
            {
                return isGroupChat
                    ? await _groupMessageService.GetGroupMessages(userId, chatId, limit, offset)
                    : await _groupMessageService.GetChatMessages(userId, chatId, limit, offset);
            }

            if (isGroupChat)
            {
                return await _groupMessageService.SearchGroupMessages(userId, chatId, searchText, limit, offset);
            }
            else
            {
                return await _groupMessageService.SearchChatMessages(userId, chatId, searchText, limit, offset);
            }
        }
    }
}


