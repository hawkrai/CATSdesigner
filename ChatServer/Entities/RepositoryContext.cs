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

            modelBuilder.Entity<GroupChat>()
                .HasIndex(gc => gc.SubjectId, "IX_GroupChats_SubjectId_Unique_SubjectGroup")
                .IsUnique()
                .HasFilter("[GroupId] IS NULL AND [IsSubjectGroup] = 1");

            modelBuilder.Entity<GroupChat>()
                .HasIndex(gc => new { gc.SubjectId, gc.GroupId }, "IX_GroupChats_SubjectId_GroupId_Unique_StudentGroup")
                .IsUnique()
                .HasFilter("[GroupId] IS NOT NULL AND [IsStudentGroup] = 1");

            modelBuilder.Entity<GroupMessage>()
                .HasOne(gm => gm.GroupChat)
                .WithMany(gc => gc.GroupMessages)
                .HasForeignKey(gm => gm.GroupChatId)
                .OnDelete(DeleteBehavior.Cascade); // Delete all chat's GroupMessages after deleting GroupChat

            modelBuilder.Entity<GroupMessage>()
                .HasOne(gm => gm.User)
                .WithMany(u => u.GroupMessages)
                .HasForeignKey(gm => gm.UserId)
                .OnDelete(DeleteBehavior.Cascade); // Delete all user's GroupMessages after deleting User

            modelBuilder.Entity<GroupChatHistory>()
                .HasOne(gch => gch.GroupChat)
                .WithMany(gc => gc.GroupChatHistory)
                .HasForeignKey(gch => gch.GroupChatId)
                .OnDelete(DeleteBehavior.Cascade); // Delete all chats's GroupChatHistory after deleting GroupChat

            modelBuilder.Entity<GroupChatHistory>()
                .HasOne(gch => gch.User)
                .WithMany(u => u.GroupChatHistory)
                .HasForeignKey(gch => gch.UserId)
                .OnDelete(DeleteBehavior.Cascade); // Delete all user's GroupChatHistory after deleting User

            modelBuilder.Entity<GroupChat>()
                .HasOne(gc => gc.Subject)
                .WithMany(s => s.GroupChats)
                .HasForeignKey(gc => gc.SubjectId)
                .OnDelete(DeleteBehavior.Cascade); // Delete all subject's GroupChats after deleting Subject

            modelBuilder.Entity<GroupChat>()
                .HasOne(gc => gc.Group)
                .WithMany(g => g.GroupChats)
                .HasForeignKey(gc => gc.GroupId)
                .OnDelete(DeleteBehavior.Cascade); // Delete all group's GroupChats after deleting Group

            modelBuilder.Entity<Student>()
                .HasOne(s => s.Group)
                .WithMany(g => g.Students)
                .HasForeignKey(s => s.GroupId)
                .OnDelete(DeleteBehavior.Cascade); // Delete all group's Students after deleting Group
        }
    }
}
