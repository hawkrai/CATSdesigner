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
        private readonly IUserService _userService;
        private readonly IGroupChatService _groupService;
        private readonly IUserChatService _userChatService;
        private readonly IUserChatHistoryService _userChatHistoryService;
        private readonly IGroupChatHistoryService _groupChatHistoryService;

        public ChatController(IGroupChatHistoryService groupChatHistoryService, IUserChatService userChatService, IUserChatHistoryService userChatHistoryService, IUserService userService, IGroupChatService groupService)
        {
            _groupChatHistoryService = groupChatHistoryService;
            _userChatService = userChatService;
            _groupService = groupService;
            _userService = userService;
            _userChatHistoryService = userChatHistoryService;
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

            var chatFromDb = await _userChatService.TryGet(chat.Name, users);
            if (chatFromDb != null)
                return chatFromDb.Id;

            await _userChatService.Create(chat);

            chat.Users = users;
            await _userChatService.Update(chat);

            var chatHistory = new UserChatHistory();
            chatHistory.ChatId = chat.Id;
            chatHistory.UserId = user.FirstId;
            chatHistory.Date = DateTime.UtcNow;
            await _userChatHistoryService.Create(chatHistory);

            chatHistory = new UserChatHistory();
            chatHistory.ChatId = chat.Id;
            chatHistory.UserId = user.SecondId;
            chatHistory.Date = DateTime.UtcNow;

            await _userChatHistoryService.Create(chatHistory);

            return chat.Id;
        }

        [HttpGet]
        public async Task<IEnumerable<UserDto>> GetAllStudents(string filter = "*", int limit = 20, int offset = 0)
        {
            return await _userService.GetStudentsAsync(false, limit, offset, filter);
        }

        [HttpGet]
        public async Task<IEnumerable<UserDto>> GetAllLecturers(string filter = "*", int limit = 20, int offset = 0)
        {
            return await _userService.GetLecturersAsync(false, limit, offset, filter);
        }

        [HttpGet]
        public async Task<IEnumerable<UserDto>> GetLecturerStudents(int lecturerId, string filter = "*", int limit = 20, int offset = 0)
        {
            return await _userService.GetLecturerStudentsAsync(lecturerId, false, limit, offset, filter);
        }

        [HttpGet]
        public async Task<IEnumerable<UserDto>> GetStudentLecturers(int studentId, string filter = "*", int limit = 20, int offset = 0)
        {
            return await _userService.GetStudentLecturersAsync(studentId, false, limit, offset, filter);
        }

        [HttpGet]
        public async Task UpdateReadChat(int userId, int chatId)
        {
            await _userChatHistoryService.UpdateLastRead(userId, chatId);
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
        public async Task<IEnumerable<SubjectChatsDto>> GetAllGroups(int userId, string role, bool completed = false)
        {
            bool isLector = role.ToLower().Equals("lector");
            return await _groupService.GetGroups(userId, isLector, completed);
        }

        [HttpGet]
        public async Task<IEnumerable<UserDto>> GetStudentsByGroupId(int groupId)
        {
            var students = await _userService.GetStudentsByGroup(groupId);

            var userDtos = new List<UserDto>();
            foreach (var student in students)
            {
                var user = await _userService.GetUser(student.UserId, false);
                userDtos.Add(new UserDto
                {
                    UserId = student.UserId,
                    GroupId = student.GroupId,
                    isOnline = user?.IsOnline ?? false,
                    FullName = student.FullName,
                    Profile = user?.Avatar
                });
            }

            return userDtos;
        }

        [HttpGet]
        public async Task<ActionResult<UserDto>> GetUserInfo(int userId)
        {
            var user = await _userService.GetUser(userId, false);
            if (user == null) return NotFound();

            string fullName = user.UserName;
            string profileUrl = user.Avatar;

            var lecturer = await _userService.GetLecturer(userId);
            if (lecturer != null)
            {
                fullName = lecturer.FullName;
            }
            else
            {
                var student = await _userService.GetStudent(userId);
                if (student != null)
                {
                    fullName = student.FullName;
                }
            }

            return Ok(new UserDto
            {
                UserId = userId,
                FullName = fullName,
                Profile = profileUrl,
                isOnline = user.IsOnline ?? false
            });
        }
    }
}
