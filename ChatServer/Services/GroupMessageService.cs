using AutoMapper;
using Contracts;
using Contracts.Services;
using Entities.CTO;
using Entities.DTO;
using Entities.Models;
using Entities.Models.GroupChatModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class GroupMessageService : IGroupMessageService
    {
        private readonly IRepositoryManager _repository;
        private readonly IMapper _mapper;
        private readonly IEncryptionService _encryptionService;

        public GroupMessageService(IRepositoryManager repository, IMapper mapper, IEncryptionService encryptionService)
        {
            _repository = repository;
            _mapper = mapper;
            _encryptionService = encryptionService;
        }

        public async Task<MessageDto> Save(int userId, GroupMessageCto messageCto)
        {
            var names = new Dictionary<int, string>();
            var newMsg = _mapper.Map<GroupMessage>(messageCto);
            newMsg.Time = DateTime.UtcNow;
            newMsg.Text = _encryptionService.Encrypt(newMsg.Text);
            newMsg.UserId = userId;

            await _repository.GroupMessages.Save(newMsg);

            await EnsureUserName(userId, names);
            newMsg.Text = _encryptionService.Decrypt(newMsg.Text);
            newMsg.User = await _repository.Users.GetUserAsync(userId, false);

            var messageDto = _mapper.Map<MessageDto>(newMsg, opts => {
                opts.Items["UserId"] = userId;
                opts.Items["Names"] = names;
            });

            return messageDto;
        }

        public async Task DeleteGroupMsg(int msgId)
        {
            var msg = await _repository.GroupMessages.GetGroupMessageAsync(msgId, true);
            if (msg != null)
            {
                _repository.GroupMessages.Remove(msg);
                await _repository.SaveAsync();
            }
        }

        public async Task<MessageDto[]> GetGroupMessages(int userId, int chatId, int limit, int offset)
        {
            var names = new Dictionary<int, string>();
            var msgs = await _repository.GroupMessages.GetGroupMessagesAsync(chatId, false, limit, offset);

            foreach (var msg in msgs)
            {
                await EnsureUserName(msg.UserId, names);
                msg.Text = _encryptionService.Decrypt(msg.Text);
            }

            var messagesDto = _mapper.Map<MessageDto[]>(msgs, opts => {
                opts.Items["UserId"] = userId;
                opts.Items["Names"] = names;
            });
            return messagesDto;
        }

        public async Task<MessageDto[]> GetChatMessages(int userId, int chatId, int limit, int offset)
        {
            var names = new Dictionary<int, string>();
            var msgs = await _repository.UserChatMessages.GetUserChatMessagesAsync(chatId, false, limit, offset);

            foreach (var msg in msgs)
            {
                await EnsureUserName(msg.UserId, names);
                msg.Text = _encryptionService.Decrypt(msg.Text);
            }

            var messagesDto = _mapper.Map<MessageDto[]>(msgs, opts => {
                opts.Items["UserId"] = userId;
                opts.Items["Names"] = names;
            });
            return messagesDto;
        }

        public async Task<MessageDto[]> SearchGroupMessages(int userId, int chatId, string searchText, int limit, int offset)
        {
            var names = new Dictionary<int, string>();
            var allMessages = await _repository.GroupMessages.SearchGroupMessagesAsync(chatId, searchText, false, 0, 0);

            var filteredMessages = new List<GroupMessage>();

            foreach (var msg in allMessages)
            {
                var decryptedText = _encryptionService.Decrypt(msg.Text);
                if (!string.IsNullOrEmpty(decryptedText) && decryptedText.Contains(searchText, StringComparison.OrdinalIgnoreCase))
                {
                    await EnsureUserName(msg.UserId, names);
                    msg.Text = decryptedText;
                    filteredMessages.Add(msg);
                }
            }

            var paginatedResults = filteredMessages
                .Skip(offset)
                .Take(limit)
                .ToList();

            var messagesDto = _mapper.Map<MessageDto[]>(paginatedResults, opts => {
                opts.Items["UserId"] = userId;
                opts.Items["Names"] = names;
            });
            return messagesDto;
        }

        public async Task<MessageDto[]> SearchChatMessages(int userId, int chatId, string searchText, int limit, int offset)
        {
            var names = new Dictionary<int, string>();
            var allMessages = await _repository.UserChatMessages.SearchUserChatMessagesAsync(chatId, searchText, false, 0, 0);

            var filteredMessages = new List<ChatMessage>();

            foreach (var msg in allMessages)
            {
                var decryptedText = _encryptionService.Decrypt(msg.Text);
                if (!string.IsNullOrEmpty(decryptedText) && decryptedText.Contains(searchText, StringComparison.OrdinalIgnoreCase))
                {
                    await EnsureUserName(msg.UserId, names);
                    msg.Text = decryptedText;
                    filteredMessages.Add(msg);
                }
            }

            var paginatedResults = filteredMessages
                .Skip(offset)
                .Take(limit)
                .ToList();

            var messagesDto = _mapper.Map<MessageDto[]>(paginatedResults, opts => {
                opts.Items["UserId"] = userId;
                opts.Items["Names"] = names;
            });
            return messagesDto;
        }

        public async Task<GroupMessage> GetMessage(int id)
        {
            var msg = await _repository.GroupMessages.GetGroupMessageAsync(id, true);
            if (msg != null)
            {
                msg.Text = _encryptionService.Decrypt(msg.Text);
            }
            return msg;
        }

        public async Task UpdateMsg(GroupMessage msg, string text)
        {
            msg.Text = _encryptionService.Encrypt(text);
            await _repository.SaveAsync();
        }

        private async Task EnsureUserName(int userId, Dictionary<int, string> names)
        {
            if (names.ContainsKey(userId)) return;

            string foundName = null;

            var lecturer = await _repository.Lecturers.GetLecturerAsync(userId, false);
            if (lecturer != null)
            {
                foundName = lecturer.FullName;
            }
            else
            {
                var student = await _repository.Students.GetStudentAsync(userId, false);
                if (student != null)
                {
                    foundName = student.FullName;
                }
                else
                {
                    var user = await _repository.Users.GetUserAsync(userId, false);
                    if (user != null)
                    {
                        foundName = user.UserName;
                    }
                }
            }

            names.Add(userId, foundName ?? $"User {userId}");
        }
    }
}
