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
        private readonly Dictionary<int, string> Names = new Dictionary<int, string>();
        public GroupMessageService(IRepositoryManager repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<MessageDto> Save(int userId,GroupMessageCto messageCto)
        {
            var newMsg = _mapper.Map<GroupMessage>(messageCto);
            newMsg.Time = DateTime.Now;
            await _repository.GroupMessages.Save(newMsg);
            var msg = await _repository.GroupMessages.GetGroupMessageAsync(newMsg.Id, false);
            if (!Names.ContainsKey(msg.UserId))
            {
                var lecturer = await _repository.Lecturers.GetLecturerAsync(msg.UserId, false);
                if (lecturer == null)
                {
                    var student = await _repository.Students.GetStudentAsync(msg.UserId, false);
                    Names.Add(msg.UserId, student.FullName);
                }
                else
                {
                    Names.Add(msg.UserId, lecturer.FullName);
                }
            }
            var messagesDto = _mapper.Map<MessageDto>(msg, opts => { opts.Items["UserId"] = userId; opts.Items["Names"] = Names; });
            return messagesDto;
        }

        public async Task DeleteGroupMsg(int msgId)
        {
            var msg = await _repository.GroupMessages.GetGroupMessageAsync(msgId, true);
            _repository.GroupMessages.Remove(msg);
            await _repository.SaveAsync();
        }

        public async Task<MessageDto[]> GetGroupMsg(int userId, int chatId)
        {
            var msgs = await _repository.GroupMessages.GetGroupMessagesAsync(chatId, false);
            var groupId = await _repository.GroupChats.GetGroupId(chatId);
            if (groupId != null)
            {
                var students = await _repository.Students.GetStudentsByGroup((int)groupId, false);
                foreach (var student in students)
                    Names.Add(student.UserId, student.FullName);
            }

            foreach (var msg in msgs)
            {
                if (!Names.ContainsKey(msg.UserId))
                {
                    var lecturer = await _repository.Lecturers.GetLecturerAsync(msg.UserId, false);
                    if (lecturer == null)
                    {
                        var student = await _repository.Students.GetStudentAsync(msg.UserId, false);
                        Names.Add(msg.UserId, student.FullName);
                    }
                    else
                    {
                        Names.Add(msg.UserId, lecturer.FullName);
                    }
                }
            }

            var messagesDto = _mapper.Map<MessageDto[]>(msgs, opts => { opts.Items["UserId"] = userId; opts.Items["Names"] = Names; });
            return messagesDto;
        }

        public async Task<MessageDto[]> GetChatMsgs(int userId, int chatId)
        {
            var msgs = await _repository.UserChatMessages.GetUserChatMessagesAsync(chatId, false);

            foreach (var msg in msgs)
            {
                if (!Names.ContainsKey(msg.UserId))
                {
                    var lecturer = await _repository.Lecturers.GetLecturerAsync(msg.UserId, false);
                    if (lecturer == null)
                    {
                        var student = await _repository.Students.GetStudentAsync(msg.UserId, false);
                        Names.Add(msg.UserId, student.FullName);
                    }
                    else
                    {
                        Names.Add(msg.UserId, lecturer.FullName);
                    }
                }
            }

            var messagesDto = _mapper.Map<MessageDto[]>(msgs, opts => { opts.Items["UserId"] = userId; opts.Items["Names"] = Names; });
            return messagesDto;
        }

        public async Task<GroupMessage> GetMessage(int id)
        {
            var msg = await _repository.GroupMessages.GetGroupMessageAsync(id, true);
            return msg;
        }

        public async Task UpdateMsg(GroupMessage msg, string text)
        {
            msg.Text = text;
            await _repository.SaveAsync();
        }
    }
}
