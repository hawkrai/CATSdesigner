using Entities;
using Entities.DTO;
using Entities.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

using System.Threading.Tasks;

namespace ChatServer.services
{
    public class ChatService
    {
        private readonly RepositoryContext _context;

        public ChatService(RepositoryContext context)
        {
            _context = context;
        }

        public async Task<List<Chat>> GetChats(int userId)
        {
            int uId = 0;
            return (await _context.Users.Where(x => x.UserId == userId).Include(x => x.UserChats).FirstOrDefaultAsync()).UserChats;
        }

        public async Task<List<Lecturer>> GetLecturers(int userId)
        {
            return await _context.Lecturers.Where(x => x.Id != userId).ToListAsync();
        }

        public async Task<List<Student>> GetStudents()
        {
            return await _context.Students.ToListAsync();
        }

        public async Task<User> GetChatUserName(int chatId, int userId)
        {
            var chatUsers = await _context.UserChats.Where(x => x.Id == chatId).Include(x => x.Users).FirstOrDefaultAsync();
            return chatUsers.Users.Where(x => x.UserId != userId).FirstOrDefault();
        }

        public async Task<List<ChatMessage>> GetMessages(int chatId)
        {
            var chat = await _context.UserChats.Where(x => x.Id == chatId).Include(x => x.Messages).ThenInclude(x=>x.User).FirstOrDefaultAsync();
            return chat.Messages;
        }

        public async Task<dynamic> GetUser(int userId)
        {
            dynamic lecturers = await _context.Lecturers.Where(x => x.Id == userId).FirstOrDefaultAsync();
            if (lecturers != null)
                return lecturers;
            dynamic students = await _context.Students.Where(x => x.UserId == userId).FirstOrDefaultAsync();
            return students;
        }

        public ChatMessage GetMessage(int msgId)
        {
            var msg = _context.ChatMessages.Where(x => x.Id == msgId).FirstOrDefault();
            return msg;
        }
    }
}
