using AutoMapper;
using Contracts;
using Contracts.Services;
using Entities.DTO;
using Entities.Models.GroupChatModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class GroupChatService : IGroupChatService
    {
        private readonly IRepositoryManager _repository;
        private readonly IMapper _mapper;

        public GroupChatService(IRepositoryManager repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<SubjectChatsDto>> GetGroups(int userId, bool isLector)
        {
            List<SubjectChatsDto> subjectChats = new List<SubjectChatsDto>();
            List<GroupChat> groups = new List<GroupChat>();
            if (isLector)
            {

                var subjects = await _repository.SubjectLecturer.GetSubjects(userId);
                foreach (var subject in subjects)
                {
                    groups.AddRange(await _repository.GroupChats.GetForLecturer(subject.SubjectId));
                }
            }
            else
            {
                var student = await _repository.Students.GetStudentAsync(userId, false);
                var subjects = await _repository.SubjectGroup.GetSubjects(student.GroupId);
                foreach (var subject in subjects)
                {
                    groups.AddRange(await _repository.GroupChats.GetForStudents(student.GroupId, subject.SubjectId));
                }
            }
            foreach (var groupChat in groups)
            {
                if (groupChat.IsSubjectGroup)
                {
                    var lastReadSubject = await _repository.GroupChatHistoryRepository.GetGroupChatHistoryAsync(userId, groupChat.Id, false);
                    var subject = new SubjectChatsDto() { Id = groupChat.Id, Name = groupChat.GroupName, ShortName = groupChat.ShortName, Color =  groupChat.Subjects.Color };
                    int? lastReaded;
                    GroupChat[] groupsModel = groups.FindAll(x => !x.IsSubjectGroup && x.SubjectId == groupChat.SubjectId).ToArray();
                    List<GroupChatDto> groupChats = new List<GroupChatDto>();
                    if (lastReadSubject != null)
                    {
                        lastReaded= groupChat.GroupMessages.FindIndex(x => x.Time > lastReadSubject.Date);
                        if (lastReaded > -1)
                            subject.Unread = groupChat.GroupMessages.Count - (int)lastReaded;
                        else
                            subject.Unread = 0;
                    }
                    for (int i = 0; i < groupsModel.Length; i++)
                    {
                        var groupChatDto = _mapper.Map<GroupChatDto>(groupsModel[i]);

                        lastReadSubject = await _repository.GroupChatHistoryRepository.GetGroupChatHistoryAsync(userId, groupsModel[i].Id, false);
                       
                        if (lastReadSubject != null)
                            lastReaded = groupsModel[i].GroupMessages.FindIndex(x => x.Time > lastReadSubject.Date);
                        else
                            lastReaded = -1;
                        if (lastReaded > -1)
                            groupChatDto.Unread = groupsModel[i].GroupMessages.Count - (int)lastReaded;
                        else
                            groupChatDto.Unread = 0;
                        groupChats.Add(groupChatDto);
                    }
                    subject.Groups = groupChats;
                    subjectChats.Add(subject);
                }
            }
            return subjectChats;
        }

    }
}
