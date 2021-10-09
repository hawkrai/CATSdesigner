using AutoMapper;
using Entities.DTO;
using Entities.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.Services
{
    public interface IUserService
    {
        Task SetStatus(int userId, bool status);
        Task<IEnumerable<ChatDto>> GetUserChats(int userId);
        Task<User> GetUser(int userId,bool track=false);
        Task<Lecturer> GetLecturer(int userId);
        Task<Student> GetStudent(int userId);
        Task<IEnumerable<Student>> GetStudetsByGroup(int groupId);
        Task<IEnumerable<UserDto>> GetLecturersAsync(bool trackChanges,string filter);
        Task<IEnumerable<UserDto>> GetStudentsAsync(bool trackChanges,string filter);
        Task UpdateLastLogin(int userId);
    }
}
