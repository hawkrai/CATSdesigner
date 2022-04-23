using AutoMapper;
using ChatServer.services;
using Contracts;
using Contracts.Services;
using Entities.CTO;
using Entities.DTO;
using Entities.Models;
using Entities.Models.GroupChatModels;
using Entities.Models.History;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatServer.Controllers
{
    [Route("ChatApi/[controller]/[action]")]
    [ApiController]
    public class ChatController : Controller
    {
        private readonly IMapper _mapper;
        private readonly IUserService _userService;
        private readonly IGroupChatService _groupService;
        private readonly IUserChatService _userChatService;
        private readonly IUserChatHistoryService _userChatHistoryService;
        private readonly IGroupChatHistoryService _groupChatHistoryService;
        private static readonly Dictionary<int, string> names = new Dictionary<int, string>();

        public ChatController(IGroupChatHistoryService groupChatHistoryService,IUserChatService userChatService, IUserChatHistoryService userChatHistoryService, IUserService userService, IGroupChatService groupService, IMapper mapper)
        {
            _groupChatHistoryService = groupChatHistoryService;
            _userChatService = userChatService;
            _groupService = groupService;
            _userService = userService;
            _userChatHistoryService = userChatHistoryService;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<int> CreateChat(ChatCto user)
        {
            var chat = new Chat();
            chat.Name = user.FirstId + "_" + user.SecondId;
            var users = new List<User>();
            var user1 = await _userService.GetUser(user.FirstId);
            var user2 = await _userService.GetUser(user.SecondId);
            users.Add(user1);
            users.Add(user2);

            //check if chat already exists
            var chatFromDb = await _userChatService.TryGet(chat.Name, users);
            if (chatFromDb != null)
                return chatFromDb.Id;

            await _userChatService.Create(chat);

            chat.Users = users;
            await _userChatService.Update(chat);

            var chatHistory = new UserChatHistory();
            chatHistory.ChatId = chat.Id;
            chatHistory.UserId = user.FirstId;
            chatHistory.Date = DateTime.Now;
            await _userChatHistoryService.Create(chatHistory);
            
            chatHistory = new UserChatHistory();
            chatHistory.ChatId = chat.Id;
            chatHistory.UserId = user.SecondId;
            chatHistory.Date = DateTime.Now;

            await _userChatHistoryService.Create(chatHistory);

            return chat.Id;
        }

        [HttpGet]
        public async Task<IEnumerable<UserDto>> GetAllStudents(string filter = "*")
        {
            return await _userService.GetStudentsAsync(true, filter);
        }

        [HttpGet]
        public async Task<IEnumerable<UserDto>> GetAllLecturers(string filter = "*")
        {
            return await _userService.GetLecturersAsync(true, filter);
        }

        [HttpGet]
        public async Task UpdateReadChat(int userId,int chatId)
        {
            await _userChatHistoryService.UpdateLastRead(userId,chatId);
        }

        [HttpGet]
        public async Task UpdateReadGroupChat(int userId, int chatId)
        {
            await _groupChatHistoryService.UpdateLastRead(userId, chatId);
        }

        [HttpGet]
        public async Task<IEnumerable<ChatDto>> GetAllChats(int userId)
        {
            return await _userService.GetUserChats(userId);
        }

        [HttpGet]
        public async Task<ChatDto> GetChatById(int userId, int chatId)
        {
            var chats = await _userService.GetUserChats(userId);
            return chats.FirstOrDefault(c => c.Id == chatId);
        }

        [HttpGet]
        public async Task<IEnumerable<SubjectChatsDto>> GetAllGroups(int userId, string role)
        {
            bool isLector = role.ToLower().Equals("lector");
            return await _groupService.GetGroups(userId, isLector);
        }

        [HttpGet]
        public async Task<IEnumerable<SubjectChatsDto>> GetGroupId(int userId, string role)
        {
            bool isLector = role.ToLower().Equals("lector");
            return await _groupService.GetGroups(userId, isLector);
        }


        //[HttpGet]
        //public async Task<IEnumerable<ContactDto>> GetContacts(int userId,string role)
        //{
        //    List<ContactDto> contacts = new List<ContactDto>();
        //    var lecturers = await _chatService.GetLecturers(userId);
        //    foreach(var lect in lecturers)
        //    {
        //        contacts.Add(new ContactDto { Id = lect.Id, Name = lect.FullName });
        //    }
        //    if (role.ToLower().Equals("lector"))
        //    {
        //        var students = await _chatService.GetStudents();
        //        foreach (var st in students)
        //        {
        //            contacts.Add(new ContactDto { Id = st.UserId, Name = st.FullName });
        //        }
        //    }
        //    return contacts;
        //}


        //[HttpGet]
        //public async Task<IEnumerable<ChatDto>> GetChats(int id)
        //{
        //    var chats = await _chatService.GetChats(id);
        //    List<ChatDto> chatsDto = new List<ChatDto>();
        //    foreach (var chat in chats)
        //    {
        //        var ch = _mapper.Map<ChatDto>(chat);
        //        if (!chat.IsGroup)
        //        {
        //            var user = await _chatService.GetChatUserName(chat.Id, id);
        //            ch.Profile = user.Avatar;
        //            ch.Name = user.FullName;
        //        }
        //        chatsDto.Add(ch);
        //    }
        //    return chatsDto;
        //}

        //[HttpGet]
        //public async Task<IEnumerable<MessageDto>> GetMessages(int chatId, int userId, string role)
        //{
        //    var msgs = await _chatService.GetMessages(chatId);

        //    var messageDtos = new List<MessageDto>();
        //    MessageDto dto = null;
        //    foreach (var msg in msgs)
        //    {
        //        dto = _mapper.Map<MessageDto>(msg);
        //        dto.ChatId = chatId;
        //        dto.Time = msg.Time.ToString("MM/dd/yyyy H:mm");
        //        if (msg.UserId == userId)
        //            dto.Align = "right";
        //        var user = await _chatService.GetUser(msg.UserId);
        //        dto.Profile = msg.User.Avatar;

        //        dto.Name = user.FullName;
        //        messageDtos.Add(dto);
        //    }

        //    return messageDtos;
        //}

        //[HttpGet]
        //public async Task<MessageDto> GetMessage(int msgId, int userId)
        //{
        //    var msg = _chatService.GetMessage(msgId);

        //    MessageDto dto = null;
        //    dto = _mapper.Map<MessageDto>(msg);
        //    dto.ChatId = msg.ChatId;
        //    dto.Time = msg.Time.ToString("MM/dd/yyyy H:mm");
        //    if (msg.UserId == userId)
        //        dto.Align = "right";
        //    dto.Profile = msg.User.Avatar;
        //    dto.Name = msg.User.FullName;
        //    return dto;
        //}

    }
}
