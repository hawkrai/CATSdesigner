using AutoMapper;
using ChatServer.Interfaces;
using Entities;
using Entities.CTO;
using Entities.DTO;
using Entities.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ChatServer.services
{
    public class MessagesService: IMessagesService
    {
        private readonly RepositoryContext _repository;
        private readonly IMapper _mapper;

        public MessagesService(RepositoryContext repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public MessageDto Save(MessageCto messageDto)
        {
            var message = _mapper.Map<ChatMessage>(messageDto);
            message.Time = DateTime.Now;
            _repository.ChatMessages.Add(message);
            _repository.SaveChanges();
            return _mapper.Map<MessageDto>(message);
        }

        public async Task<MessageDto> GetMessage(int msgId, int userId)
        {
            var msg = await _repository.ChatMessages.Where(x => x.Id == msgId).Include(x => x.User).FirstOrDefaultAsync();
            var dto=_mapper.Map<MessageDto>(msg);
     
            dto.Time = msg.Time.ToString("MM/dd/yyyy H:mm");
            if (msg.UserId == userId)
                dto.Align = "right";
            dto.Profile = msg.User.Avatar;
            dto.Name = msg.User.FullName;
            return dto;
        }
    }
}
