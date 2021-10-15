using Entities.Models;
using Entities.Models.GroupChatModels;
using Entities.Models.History;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Entities
{
    public class RepositoryContext : DbContext
    {

        public DbSet<User> Users { get; set; }
        public DbSet<Lecturer> Lecturers { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<ChatMessage> ChatMessages { get; set; }
        public DbSet<Chat> UserChats { get; set; }
        public DbSet<GroupChat> GroupChats { get; set; }
        public DbSet<SubjectLecturer> SubjectLecturers { get; set; }
        public DbSet<SubjectGroup> SubjectGroups { get; set; }
        public DbSet<GroupMessage> GroupMessages { get; set; }
        public DbSet<GroupChatHistory> GroupChatHistory { get; set; }
        public DbSet<UserChatHistory> UserChatHistory { get; set; }

        
        public RepositoryContext(DbContextOptions<RepositoryContext> options) : base(options)
        {
        }
    }
}
