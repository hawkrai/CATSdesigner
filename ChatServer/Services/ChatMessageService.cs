using AutoMapper;
using Contracts;
using Contracts.Services;
using Entities.CTO;
using Entities.DTO;
using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class ChatMessageService : IChatMessageService
    {
        private readonly IRepositoryManager _repository;
        private readonly IMapper _mapper;
        private readonly Dictionary<int, string> Names = new Dictionary<int, string>();
        public ChatMessageService(IRepositoryManager repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<MessageDto> Save(int userId, MessageCto messageCto)
        {
            var newMsg = _mapper.Map<ChatMessage>(messageCto);
            newMsg.Time = DateTime.Now;
            await _repository.UserChatMessages.Save(newMsg);
            var msg = await _repository.UserChatMessages.GetUserChatMessageAsync(newMsg.Id, false);
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

        public async Task DeleteChatMsg(int msgId)
        {
            var msg = await _repository.UserChatMessages.GetUserChatMessageAsync(msgId, true);
            _repository.UserChatMessages.Remove(msg);
            await _repository.SaveAsync();
        }

        public async Task<ChatMessage> GetMessage(int id)
        {
            var msg= await _repository.UserChatMessages.GetUserChatMessageAsync(id, true);
            return msg;
        }

        public async Task UpdateMsg(ChatMessage msg, string text)
        {
            msg.Text = text;
            await _repository.SaveAsync();
        }
    }
}