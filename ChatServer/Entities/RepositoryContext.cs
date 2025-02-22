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
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<Group> Groups { get; set; }


        public RepositoryContext(DbContextOptions<RepositoryContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<GroupMessage>()
                .HasOne(gm => gm.GroupChat)
                .WithMany(gc => gc.GroupMessages)
                .HasForeignKey(gm => gm.GroupChatId)
                .OnDelete(DeleteBehavior.Cascade); // При удалении чата удаляются все сообщения

            modelBuilder.Entity<GroupMessage>()
                .HasOne(gm => gm.User)
                .WithMany(u => u.GroupMessages)
                .HasForeignKey(gm => gm.UserId)
                .OnDelete(DeleteBehavior.Cascade); // При удалении пользователя удаляются все его сообщения

            modelBuilder.Entity<GroupChatHistory>()
                .HasOne(gch => gch.GroupChat)
                .WithMany(gc => gc.GroupChatHistory)
                .HasForeignKey(gch => gch.GroupChatId)
                .OnDelete(DeleteBehavior.Cascade); // При удалении чата удаляются все истории

            modelBuilder.Entity<GroupChatHistory>()
                .HasOne(gch => gch.User)
                .WithMany(u => u.GroupChatHistory)
                .HasForeignKey(gch => gch.UserId)
                .OnDelete(DeleteBehavior.Cascade); // При удалении пользователя удаляются все его истории

            modelBuilder.Entity<GroupChat>()
                .HasOne(gc => gc.Subject)
                .WithMany(s => s.GroupChats)
                .HasForeignKey(gc => gc.SubjectId)
                .OnDelete(DeleteBehavior.Cascade); // При удалении предмета удаляются все прикрепленные чаты

            modelBuilder.Entity<GroupChat>()
                .HasOne(gc => gc.Group)
                .WithMany(g => g.GroupChats)
                .HasForeignKey(gc => gc.GroupId)
                .OnDelete(DeleteBehavior.Cascade); // При удалении группы удаляются все прикрепленные чаты

            modelBuilder.Entity<Student>()
                .HasOne(s => s.Group)
                .WithMany(g => g.Students)
                .HasForeignKey(s => s.GroupId)
                .OnDelete(DeleteBehavior.Cascade); // При удалении группы удаляются все студенты из этой группы
        }
    }
}
