using AutoMapper;
using Entities.CTO;
using Entities.DTO;
using Entities.Models;
using Entities.Models.GroupChatModels;
using System;
using System.Collections.Generic;

namespace Entities
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Chat, ChatDto>();
            CreateMap<MessageCto, ChatMessage>();
            CreateMap<MessageDto, ChatMessage>();
            CreateMap<MessageCto, GroupMessage>();
            CreateMap<GroupMessageCto, GroupMessage>().ForMember(x => x.GroupChatId, _ => _.MapFrom(_ => _.ChatId));

            CreateMap<ChatMessage, MessageDto>()
                .ForMember(dest => dest.Time, opt => opt.MapFrom(src => EnsureUtc(src.Time)))
                .ForMember(_ => _.ChatId, _ => _.MapFrom(_ => _.ChatId))
                .ForMember(_ => _.Align, opt => opt.MapFrom((src, dest, destMember, context) => ((int)context.Items["UserId"] == src.UserId) ? "right" : ""))
                .ForMember(_ => _.Name, opt => opt.MapFrom((src, dest, destMember, context) => ((Dictionary<int, string>)context.Items["Names"])[src.UserId]))
                .ForMember(_ => _.Profile, _ => _.MapFrom(_ => _.User.Avatar ));

            CreateMap<GroupMessage, MessageDto>()
                .ForMember(dest => dest.Time, opt => opt.MapFrom(src => EnsureUtc(src.Time)))
                .ForMember(_ => _.ChatId, _ => _.MapFrom(_ => _.GroupChatId))
                .ForMember(_ => _.Align, opt => opt.MapFrom((src, dest, destMember, context) => ((int)context.Items["UserId"] == src.UserId) ? "right" : ""))
                .ForMember(_ => _.Name, opt => opt.MapFrom((src, dest, destMember, context) => ((Dictionary<int, string>)context.Items["Names"])[src.UserId]))
                .ForMember(_ => _.Profile, _ => _.MapFrom(_ => _.User.Avatar));

            CreateMap<GroupChat, GroupChatDto>()
                .ForMember(x => x.Name, y => y.MapFrom(z => z.GroupName))
                .ForMember(x => x.GroupId, y => y.MapFrom(z => z.GroupId));
        }

        private DateTime EnsureUtc(DateTime dt)
        {
            if (dt.Kind == DateTimeKind.Unspecified)
            {
                return DateTime.SpecifyKind(dt, DateTimeKind.Utc);
            }
            return dt.ToUniversalTime();
        }
    }
}
