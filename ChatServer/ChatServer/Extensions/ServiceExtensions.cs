
using Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Contracts;
using Repository;
using ChatServer;
using Services;
using Contracts.Services;
using ChatServer.Interfaces;
using ChatServer.services;

namespace Server.Extensions
{
    public static class ServiceExtensions
    {
        public static void ConfigureCors(this IServiceCollection services) =>
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", builder =>
                builder.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader()
                .WithExposedHeaders("*"));
            });

        public static void ConfigureServices(this IServiceCollection services)
        {
            services.AddScoped(typeof(ChatService));
            services.AddScoped<IMessagesService, MessagesService>();

            services.AddScoped<IRepositoryManager, RepositoryManager>();

            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IUserChatHistoryService, UserChatHistoryService>();
            services.AddScoped<IGroupChatHistoryService, GroupChatHistoryService>();
            services.AddScoped<IGroupChatService, GroupChatService>();
            services.AddScoped<IGroupMessageService, GroupMessageService>();
            services.AddScoped<IUserChatService, UserChatService>();
            services.AddScoped<IChatMessageService, ChatMessageService>();

            services.AddAutoMapper(c => c.AddProfile<MappingProfile>(), typeof(Startup));

        }

        public static void ConfigureSqlContext(this IServiceCollection services, IConfiguration configuration) =>
                services.AddDbContext<RepositoryContext>(opts => opts.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
    }
}
