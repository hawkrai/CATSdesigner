using AutoMapper;
using ChatServer.Interfaces;
using ChatServer.Models;
using ChatServer.services;
using Contracts;
using Contracts.Services;
using Entities.CTO;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatServer.Hubs
{
    public class MessageHub : Hub
    {
        private readonly ChatService _chatService;

        private static readonly Dictionary<string, (int UserId, string Role)> users = new Dictionary<string, (int UserId, string Role)>();
        private static readonly ConcurrentDictionary<int, GroupCallInfo> _activeGroupCalls = new ConcurrentDictionary<int, GroupCallInfo>();

        private readonly IRepositoryManager _repository;
        private readonly IUserService _userService;
        private readonly IGroupMessageService _groupMessageService;
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
            // Проверяем, есть ли уже соединение для этого пользователя, чтобы избежать дубликатов
            if (users.ContainsKey(Context.ConnectionId))
            {
                users.Remove(Context.ConnectionId);
            }
            users.Add(Context.ConnectionId, (id, role));

            await _userService.SetStatus(id, true);
            await Clients.All.SendAsync("Status", users[Context.ConnectionId].UserId, true);

            var channels = await _chatService.GetChats(id);
            bool isStudent = !role.ToLower().Equals("lector");

            var userGroupChatIds = new List<int>();

            if (isStudent)
            {
                var student = await _repository.Students.GetStudentAsync(id, false);
                if (student != null)
                {
                    var subjects = await _repository.SubjectGroup.GetSubjects(student.GroupId);
                    foreach (var subject in subjects)
                    {
                        var groupChats = await _repository.GroupChats.GetForStudents(student.GroupId, subject.SubjectId);
                        foreach (var chat in groupChats)
                        {
                            await Groups.AddToGroupAsync(Context.ConnectionId, chat.Id.ToString() + "G");
                            userGroupChatIds.Add(chat.Id);
                        }
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
                        userGroupChatIds.Add(chat.Id);
                    }
                }
            }

            foreach (var item in channels)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, item.Id.ToString());
            }

            foreach (var activeCall in _activeGroupCalls)
            {
                if (userGroupChatIds.Contains(activeCall.Key))
                {
                    await Clients.Client(Context.ConnectionId).SendAsync("GroupCallStarted", activeCall.Key);
                }
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
            await Clients.Group(chatId.ToString() + "G").SendAsync("EditedMessage", chatId, msgId, text);
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
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }

        public async Task AddChat(int firstUserId, int secondUserId, int chatId)
        {
            var user1 = users.Where(x => x.Value.UserId == firstUserId).ToList();
            var user2 = users.Where(x => x.Value.UserId == secondUserId).ToList();
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

        public async Task UpdateMediaStatus(int chatId, string deviceType, bool newStatus, bool isGroupChat)
        {
            var userId = users[Context.ConnectionId].UserId;

            string groupName = isGroupChat ? chatId.ToString() + "G" : chatId.ToString();

            await Clients.GroupExcept(groupName, Context.ConnectionId)
                         .SendAsync("RemoteMediaStatusChanged", chatId, userId, deviceType, newStatus);
        }

        public async override Task OnDisconnectedAsync(Exception exception)
        {
            if (users.ContainsKey(Context.ConnectionId))
            {
                var user = users[Context.ConnectionId];
                await Clients.All.SendAsync("Status", user.UserId, false);
                await _userService.SetStatus(user.UserId, false);

                foreach (var groupCall in _activeGroupCalls)
                {
                    if (groupCall.Value.Participants.Contains(Context.ConnectionId))
                    {
                        if (groupCall.Value.OwnerConnectionId == Context.ConnectionId)
                        {
                            _ = EndGroupCall(groupCall.Key);
                        }
                        else 
                        {
                            _ = LeaveGroupCall(groupCall.Key);
                        }
                    }
                }

                users.Remove(Context.ConnectionId);
            }
            await base.OnDisconnectedAsync(exception);
        }

        #region Personal video chat methods

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

        public async Task FireCandidateV2(object candidate, int chatId)
        {
            await Clients.GroupExcept(
                    chatId.ToString(),
                    Context.ConnectionId
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

        #region Group video chat methods

        public async Task StartGroupCall(int groupChatId)
        {
            if (users.TryGetValue(Context.ConnectionId, out var caller) && caller.Role.ToLower() == "lector")
            {
                var newCall = new GroupCallInfo
                {
                    OwnerConnectionId = Context.ConnectionId
                };
                newCall.Participants.Add(Context.ConnectionId);

                _activeGroupCalls[groupChatId] = newCall;

                await Clients.Group(groupChatId.ToString() + "G").SendAsync("GroupCallStarted", groupChatId);
            }
        }

        public async Task EndGroupCall(int groupChatId)
        {
            if (_activeGroupCalls.TryGetValue(groupChatId, out var callInfo) && callInfo.OwnerConnectionId == Context.ConnectionId)
            {
                if (_activeGroupCalls.TryRemove(groupChatId, out _))
                {
                    await Clients.Group(groupChatId.ToString() + "G").SendAsync("GroupCallEnded", groupChatId);
                }
            }
        }

        public async Task JoinGroupCall(int groupChatId)
        {
            if (_activeGroupCalls.TryGetValue(groupChatId, out var callInfo))
            {
                var existingParticipants = callInfo.Participants
                    .Where(cid => users.ContainsKey(cid))
                    .ToDictionary(cid => cid, cid => users[cid].UserId);

                callInfo.Participants.Add(Context.ConnectionId);

                await Clients.Caller.SendAsync("ExistingParticipantsInGroupCall", groupChatId, existingParticipants);

                if (users.TryGetValue(Context.ConnectionId, out var newUserInfo))
                {
                    var newParticipantPayload = new Dictionary<string, int> { { Context.ConnectionId, newUserInfo.UserId } };
                    await Clients.GroupExcept(groupChatId.ToString() + "G", Context.ConnectionId).SendAsync("NewParticipantInGroupCall", groupChatId, newParticipantPayload);
                }
            }
        }

        public async Task LeaveGroupCall(int groupChatId)
        {
            if (_activeGroupCalls.TryGetValue(groupChatId, out var callInfo))
            {
                if (callInfo.Participants.Remove(Context.ConnectionId))
                {
                    if (users.TryGetValue(Context.ConnectionId, out var userInfo))
                    {
                        await Clients.GroupExcept(groupChatId.ToString() + "G", Context.ConnectionId).SendAsync("ParticipantLeftGroupCall", groupChatId, Context.ConnectionId, userInfo.UserId);
                    }
                    else
                    {
                        await Clients.GroupExcept(groupChatId.ToString() + "G", Context.ConnectionId).SendAsync("ParticipantLeftGroupCall", groupChatId, Context.ConnectionId, -1);
                    }
                }
            }
        }

        public async Task SendGroupOffer(string targetConnectionId, object offer)
        {
            await Clients.Client(targetConnectionId).SendAsync("ReceiveGroupOffer", Context.ConnectionId, offer);
        }

        public async Task SendGroupAnswer(string targetConnectionId, object answer)
        {
            await Clients.Client(targetConnectionId).SendAsync("ReceiveGroupAnswer", Context.ConnectionId, answer);
        }

        public async Task SendGroupIceCandidate(string targetConnectionId, object candidate)
        {
            await Clients.Client(targetConnectionId).SendAsync("ReceiveGroupIceCandidate", Context.ConnectionId, candidate);
        }

        #endregion
    }
}