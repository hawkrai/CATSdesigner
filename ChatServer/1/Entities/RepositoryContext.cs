using Entities.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Entities
{
    public class RepositoryContext : DbContext
    {

        public DbSet<User> Users { get; set; }
        public DbSet<Lecturer> Lecturers { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<ChatMessage> ChatMessages { get; set; }
        public DbSet<Chat> Chats { get; set; }

        public RepositoryContext(DbContextOptions<RepositoryContext> options) : base(options)
        {
         //   Database.EnsureCreated();
        }
            

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
        }

    }
}
