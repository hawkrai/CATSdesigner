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

        public async Task<IEnumerable<UserDto>> GetLecturersAsync(bool trackChanges, int limit, int offset, string filter) => 
            await _repository.Lecturers.GetLecturersAsync(trackChanges, limit, offset, filter);

        public async Task<IEnumerable<UserDto>> GetStudentsAsync(bool trackChanges, int limit, int offset, string filter) => 
            await _repository.Students.GetStudentsAsync(trackChanges, limit, offset, filter);

        public async Task<IEnumerable<UserDto>> GetLecturerStudentsAsync(int lecturerId, bool trackChanges, int limit, int offset, string filter)
        {
            var lecturer = await _repository.Lecturers.GetLecturerAsync(lecturerId, false);
            if (lecturer == null || !lecturer.IsActive)
            {
                return new List<UserDto>();
            }

            var subjectLecturers = await _repository.SubjectLecturer.GetSubjects(lecturerId);
            var subjectIds = subjectLecturers.Select(sl => sl.SubjectId).Distinct().ToList();

            if (!subjectIds.Any())
                return new List<UserDto>();

            var subjectGroups = await _repository.SubjectGroup.GetGroupsBySubjectIds(subjectIds);
            var groupIds = subjectGroups.Select(g => g.GroupId).Distinct().ToList();

            if (!groupIds.Any()) 
                return new List<UserDto>();

            var studentsResult = new List<UserDto>();
            foreach (var groupId in groupIds)
            {
                var groupStudentEntities = await _repository.Students.GetStudentsByGroup(groupId, false);

                var filteredByName = groupStudentEntities;
                if (filter != "*")
                {
                    filteredByName = groupStudentEntities
                        .Where(s => (s.MiddleName + " " + s.FirstName + " " + s.LastName).Contains(filter, StringComparison.InvariantCultureIgnoreCase) ||
                                    (s.FirstName + " " + s.LastName).Contains(filter, StringComparison.InvariantCultureIgnoreCase) ||
                                    s.LastName.Contains(filter, StringComparison.InvariantCultureIgnoreCase))
                        .ToList();
                }

                foreach (var student in filteredByName)
                {
                    var user = await _repository.Users.GetUserAsync(student.UserId, false);

                    studentsResult.Add(new UserDto
                    {
                        UserId = student.UserId,
                        GroupId = student.GroupId,
                        isOnline = user?.IsOnline ?? false,
                        FullName = student.FullName,
                        Profile = user?.Avatar
                    });
                }
            }

            return studentsResult
                .OrderBy(s => s.FullName)
                .Skip(offset)
                .Take(limit)
                .ToList();
        }

        public async Task<IEnumerable<UserDto>> GetStudentLecturersAsync(int studentId, bool trackChanges, int limit, int offset, string filter)
        {
            var student = await _repository.Students.GetStudentAsync(studentId, false);
            if (student == null || !(student.IsActive && (student.Confirmed == true || (student.Confirmed == null && student.DeletedOn == null))))
            {
                return new List<UserDto>();
            }

            var subjectGroups = await _repository.SubjectGroup.GetSubjects(student.GroupId);
            var subjectIds = subjectGroups.Select(sg => sg.SubjectId).Distinct().ToList();

            if (!subjectIds.Any()) 
                return new List<UserDto>();

            var subjectLecturers = await _repository.SubjectLecturer.GetLecturersBySubjectIds(subjectIds);
            var lecturerIds = subjectLecturers.Select(sl => sl.LecturerId).Distinct().ToList();

            if (!lecturerIds.Any()) 
                return new List<UserDto>();

            var lecturersResult = new List<UserDto>();
            foreach (var lecturerId in lecturerIds)
            {
                var lecturerEntity = await _repository.Lecturers.GetLecturerAsync(lecturerId, false);
                if (lecturerEntity != null && lecturerEntity.IsActive)
                {
                    if (filter == "*" || (lecturerEntity.MiddleName + " " + lecturerEntity.FirstName + " " + lecturerEntity.LastName).Contains(filter, StringComparison.InvariantCultureIgnoreCase) ||
                        (lecturerEntity.FirstName + " " + lecturerEntity.LastName).Contains(filter, StringComparison.InvariantCultureIgnoreCase) ||
                         lecturerEntity.LastName.Contains(filter, StringComparison.InvariantCultureIgnoreCase))
                    {
                        var user = await _repository.Users.GetUserAsync(lecturerId, false);

                        lecturersResult.Add(new UserDto
                        {
                            UserId = lecturerId,
                            isOnline = user?.IsOnline ?? false,
                            FullName = lecturerEntity.FullName,
                            Profile = user?.Avatar
                        });
                    }
                }
            }

            return lecturersResult
                .OrderBy(l => l.FullName)
                .Skip(offset)
                .Take(limit)
                .ToList();
        }

        public async Task<IEnumerable<Student>> GetStudentsByGroup(int groupId) => await _repository.Students.GetStudentsByGroup(groupId, false);

        public async Task<Lecturer> GetLecturer(int userId) => await _repository.Lecturers.GetLecturerAsync(userId, false);

        public async Task<Student> GetStudent(int userId) => await _repository.Students.GetStudentAsync(userId, false);

        public async Task<User> GetUser(int userId,bool track=false) => await _repository.Users.GetUserAsync(userId, track);

        public async Task<IEnumerable<ChatDto>> GetUserChats(int userId)
        {
            var user = await _repository.Users.GetUserChats(userId, false);

            if (user == null || user.UserChats == null)
            {
                return new List<ChatDto>();
            }

            var chats = user.UserChats.ToList();
            var chatsDTO = _mapper.Map<List<ChatDto>>(chats);

            for (int i = 0; i < chats.Count; i++)
            {
                var currentChat = chats[i];
                var currentChatDto = chatsDTO[i];

                var chatUsers = (await _repository.UserChats.GetChatUsers(chatsDTO[i].Id)).Users;
                if (chatUsers == null || chatUsers.Count != 2) continue;

                User secondUser = chatUsers.FirstOrDefault(u => u.UserId != userId);
                if (secondUser == null) continue;

                currentChatDto.UserId = secondUser.UserId;
                currentChatDto.IsOnline = secondUser.IsOnline;
                currentChatDto.Img = secondUser.Avatar;
                string fullName = secondUser.FullName;
                Lecturer lecturer = await _repository.Lecturers.GetLecturerAsync(secondUser.UserId, false);

                if (lecturer != null)
                {
                    fullName = lecturer.FullName;
                }
                else
                {
                    Student student = await _repository.Students.GetStudentAsync(secondUser.UserId, false);
                    if (student != null)
                    {
                        fullName = student.FullName;
                    }
                }
                currentChatDto.Name = fullName;

                var history = user.UserChatHistory.FirstOrDefault(x => x.ChatId == chats[i].Id);
                var messages = currentChat.Messages ?? new List<ChatMessage>();
                int unreadCount = 0;

                if (history != null)
                {
                    unreadCount = messages.Count(x => x.Time > history.Date);
                }
                else
                {
                    unreadCount = messages.Count;
                }
                currentChatDto.Unread = unreadCount;
            }

            return chatsDTO;
        }

        public async Task UpdateLastLogin(int userId)
        {
            var user=await GetUser(userId, true);
            user.LastLogin = DateTime.Now;
            await _repository.SaveAsync();
        }
    }
}
