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
        private readonly ChatService _chatService;
        private readonly IMapper _mapper;
        private readonly IRepositoryManager _repository;
        private readonly IUserService _userService;
        private readonly IGroupChatService _groupService;
        private readonly IGroupMessageService _groupMessageService;

        public MessageController(IGroupMessageService groupMessageService, ChatService channelService, IUserService userService, IGroupChatService groupService, IRepositoryManager repository, IMapper mapper)
        {
            _groupMessageService = groupMessageService;
            _groupService = groupService;
            _userService = userService;
            _repository = repository;
            _chatService = channelService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IEnumerable<MessageDto>> GetGroupMsgs(int userId, int chatId)
        {
            var msgs = await _groupMessageService.GetGroupMsg(userId, chatId);
            return msgs;
        }

        [HttpGet]
        public async Task<IEnumerable<MessageDto>> GetChatMsgs(int userId, int chatId)
        {
            var msgs = await _groupMessageService.GetChatMsgs(userId, chatId);
            return msgs;
        }
    }
}


