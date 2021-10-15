using AutoMapper;
using Contracts;
using Contracts.Services;
using Entities.DTO;
using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class UserService : IUserService
    {
        private readonly IRepositoryManager _repository;
        private readonly IMapper _mapper;

        public UserService(IRepositoryManager repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task SetStatus(int userId,bool status)
        {
            var user = await GetUser(userId, true);
            user.IsOnline = status;
            await _repository.SaveAsync();
        }

        public async Task<IEnumerable<UserDto>> GetLecturersAsync(bool trackChanges, string filter) => await _repository.Lecturers.GetLecturersAsync(trackChanges, filter);

        public async Task<IEnumerable<UserDto>> GetStudentsAsync(bool trackChanges, string filter) => await _repository.Students.GetStudentsAsync(trackChanges, filter);

        public async Task<IEnumerable<Student>> GetStudetsByGroup(int groupId) => await _repository.Students.GetStudentsByGroup(groupId, false);

        public async Task<Lecturer> GetLecturer(int userId) => await _repository.Lecturers.GetLecturerAsync(userId, false);

        public async Task<Student> GetStudent(int userId) => await _repository.Students.GetStudentAsync(userId, false);

        public async Task<User> GetUser(int userId,bool track=false) => await _repository.Users.GetUserAsync(userId, track);

        public async Task<IEnumerable<ChatDto>> GetUserChats(int userId)
        {
            var user = await _repository.Users.GetUserChats(userId, false);
            var chats = user.UserChats;
            var chatDTO = _mapper.Map<List<ChatDto>>(chats);
            for (int i = 0; i < chats.Count; i++)
            {
                var history = user.UserChatHistory.FirstOrDefault(x => x.ChatId == chats[i].Id);
                if (history != null)
                { 
                    var lastReaded = chats[i].Messages.FindIndex(x => x.Time > history.Date);
                    if (lastReaded > -1)
                        chatDTO[i].Unread = chats[i].Messages.Count - lastReaded;
                    else
                        chatDTO[i].Unread = 0;
                }
                var users = (await _repository.UserChats.GetChatUsers(chatDTO[i].Id)).Users;
                string fullName = "";
                string image = "";
                User secondUser = null;
                if (users[0].UserId == userId)
                {
                    Lecturer lecturer = null;
                    image = users[1].Avatar;
                    lecturer = await _repository.Lecturers.GetLecturerAsync(users[1].UserId, false);
                    if (lecturer == null)
                    {
                        var student = await _repository.Students.GetStudentAsync(users[1].UserId, false);
                        fullName = student.FullName;
                    }
                    else
                        fullName = lecturer.FullName;
                    secondUser = await _repository.Users.GetUserAsync(users[1].UserId, false);
                }
                else
                {
                    Lecturer lecturer = null;
                    image = users[0].Avatar;
                    lecturer = await _repository.Lecturers.GetLecturerAsync(users[0].UserId, false);
                    if (lecturer == null)
                    {
                        var student = await _repository.Students.GetStudentAsync(users[0].UserId, false);
                        fullName = student.FullName;
                    }
                    else
                        fullName = lecturer.FullName;
                    secondUser = await _repository.Users.GetUserAsync(users[0].UserId, false);
                }
                chatDTO[i].IsOnline = secondUser.IsOnline;
                chatDTO[i].UserId = secondUser.UserId;
                chatDTO[i].Name = fullName;
                chatDTO[i].Img = image;
            }
            return chatDTO;
        }

        public async Task UpdateLastLogin(int userId)
        {
            var user=await GetUser(userId, true);
            user.LastLogin = DateTime.Now;
            await _repository.SaveAsync();
        }

    }
}
