using ChatServer.services;
using Entities;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System;
using Entities.Models;
using AutoMapper;
using ChatServer.Interfaces;
using Entities.DTO;
using Entities.CTO;
using Microsoft.EntityFrameworkCore;
using Contracts;
using Entities.Models.GroupChatModels;
using Contracts.Services;
using Contracts.Repositories;

namespace ChatServer.Hubs
{
    public class MessageHub : Hub
    {
        private readonly ChatService _chatService;

        private static readonly Dictionary<string, int> users = new Dictionary<string, int>();

        private readonly IRepositoryManager _repository;
        private readonly IUserService _userService;
        private readonly IGroupMessageService _groupMessageService;
        private readonly IUserChatMessageRepository _userChatMessageRepository;
        private readonly IChatMessageService _chatMessageService;

        public MessageHub(ChatService сhannelService, IChatMessageService chatMessageService,
            IGroupMessageService groupMessageService, IRepositoryManager repository, IUserService userService,
            IMessagesService messagesService, IMapper mapper) : base()
        {
            _chatMessageService = chatMessageService;
            _userService = userService;
            _repository = repository;
            _chatService = сhannelService;
            _groupMessageService = groupMessageService;
        }


        public async Task Join(string userId, string role)
        {
            var id = int.Parse(userId);
            users.Add(Context.ConnectionId, id);
            await _userService.SetStatus(id, true);
            await Clients.All.SendAsync("Status", users[Context.ConnectionId], true);
            var channels = await _chatService.GetChats(id);
            bool isStudent = !role.ToLower().Equals("lector");
            if (isStudent)
            {
                var groupId = (await _repository.Students.GetStudentAsync(id, false)).GroupId;
                var subjects = await _repository.SubjectGroup.GetSubjects(groupId);
                foreach (var subject in subjects)
                {
                    var groupChats = await _repository.GroupChats.GetForStudents(groupId, subject.SubjectId);
                    foreach (var chat in groupChats)
                    {
                        await Groups.AddToGroupAsync(Context.ConnectionId, chat.Id.ToString() + "G");
                    }
                }
            }
            else
            {
                var subjects = await _repository.SubjectLecturer.GetSubjects(id);
                foreach (var subject in subjects)
                {
                    var groupChats = await _repository.GroupChats.GetForLecturer(subject.SubjectId);
                    foreach (var chat in groupChats)
                    {
                        await Groups.AddToGroupAsync(Context.ConnectionId, chat.Id.ToString() + "G");
                    }
                }
            }

            foreach (var item in channels)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, item.Id.ToString());
            }
        }

        public async Task SendMessage(string userId, string messageJson)
        {
            var id = int.Parse(userId);
            var message = JsonConvert.DeserializeObject<MessageCto>(messageJson);
            var msg = await _chatMessageService.Save(id, message);
            await Clients.Caller.SendAsync("GetMessage", msg);

            msg.Align = null;
            await Clients.GroupExcept(message.ChatId.ToString(), Context.ConnectionId).SendAsync("GetMessage", msg);
        }

        public async Task DeleteChatMsg(string msgId, string chatId)
        {
            var id = int.Parse(msgId);
            await _chatMessageService.DeleteChatMsg(id);
            await Clients.Group(chatId).SendAsync("RemovedMessage", chatId, msgId);
        }

        public async Task UpdateChatMessage(int msgId, string text, int chatId)
        {
            var msg = await _chatMessageService.GetMessage(msgId);
            await _chatMessageService.UpdateMsg(msg, text);
            await Clients.Group(chatId.ToString()).SendAsync("EditedMessage", chatId, msgId, text);
        }

        public async Task UpdateGroupMessage(int msgId, string text, int chatId)
        {
            var msg = await _groupMessageService.GetMessage(msgId);
            await _groupMessageService.UpdateMsg(msg, text);
            await Clients.Group(chatId.ToString()).SendAsync("EditedMessage", chatId, msgId, text);
        }

        public async Task DeleteGroupMsg(string msgId, string chatId)
        {
            var id = int.Parse(msgId);
            await _groupMessageService.DeleteGroupMsg(id);
            await Clients.Group(chatId + "G").SendAsync("RemovedMessage", chatId, msgId);
        }

        public async Task SendGroupMessage(string userId, string role, string messageJson)
        {
            var id = int.Parse(userId);
            var messageCto = JsonConvert.DeserializeObject<GroupMessageCto>(messageJson);
            var msg = await _groupMessageService.Save(id, messageCto);
            try
            {
                await Clients.Caller.SendAsync("GetMessage", msg);
                msg.Align = null;
                await Clients.GroupExcept(messageCto.ChatId.ToString() + "G", Context.ConnectionId)
                    .SendAsync("GetMessage", msg);
            }
            catch
            {
                Console.WriteLine("Error");
            }
        }

        public async Task AddChat(int firstUserId, int secondUserId, int chatId)
        {
            var user1 = users.Where(x => x.Value == firstUserId).ToList();
            var user2 = users.Where(x => x.Value == secondUserId).ToList();
            if (user1.Count != 0)
            {
                foreach (var keyValue in user1)
                {
                    await Groups.AddToGroupAsync(keyValue.Key, chatId.ToString());
                }
            }

            if (user2.Count != 0)
            {
                foreach (var keyValue in user2)
                {
                    await Groups.AddToGroupAsync(keyValue.Key, chatId.ToString());
                }
            }

            await Clients.Group(chatId.ToString()).SendAsync("NewChat", firstUserId, secondUserId, chatId);
        }

        public async override Task OnDisconnectedAsync(Exception exception)
        {
            await Clients.All.SendAsync("Status", users[Context.ConnectionId], false);
            await _userService.SetStatus(users[Context.ConnectionId], false);
            users.Remove(Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }

        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        #region video chat methods

        public async Task SendCallRequest(string userId, int chatId)
        {
            await Clients.GroupExcept(chatId.ToString(), Context.ConnectionId)
                .SendAsync("HandleIncomeCall", chatId);
        }

        public async Task DisconnectFromChat(string userId, int chatId)
        {
            await Clients.GroupExcept(chatId.ToString(), Context.ConnectionId)
                .SendAsync("HandleDisconnection", chatId, userId);
        }

        public async Task SetVoiceChatConnection(int chatId, string userId)
        {
            await Clients
                .GroupExcept(
                    chatId.ToString(),
                    Context.ConnectionId
                )
                .SendAsync(
                    "AddNewcomer",
                    Context.ConnectionId,
                    chatId);
        }

        public async Task SendOffer(int chatId, object offer, string fromConnectionId)
        {
            await Clients.Client(
                    fromConnectionId
                )
                .SendAsync(
                    "RegisterOffer",
                    chatId,
                    offer,
                    Context.ConnectionId
                );
        }

        public async Task SendAnswer(object answer, string fromConnectionId)
        {
            await Clients.Client(
                    fromConnectionId
                )
                .SendAsync(
                    "RegisterAnswer",
                    answer,
                    Context.ConnectionId
                );
        }

        public async Task FireCandidate(object candidate, string connectionId)
        {
            await Clients.Client(
                    connectionId
                )
                .SendAsync(
                    "HandleNewCandidate",
                    candidate,
                    Context.ConnectionId
                );
        }

        public async Task Reject(int chatId, string message)
        {
            await Clients
                .GroupExcept(
                    chatId.ToString(),
                    Context.ConnectionId
                )
                .SendAsync(
                    "HandleRejection",
                    chatId,
                    message);
        }
        #endregion
    }
}