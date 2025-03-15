using AutoMapper;
using Contracts;
using Contracts.Services;
using Entities.DTO;
using Entities.Models;
using Entities.Models.GroupChatModels;
using Entities.Models.History;
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
            List<GroupChat> groupChats = new List<GroupChat>();

            if (isLector)
            {
                var subjects = (await _repository.SubjectLecturer.GetSubjects(userId)).GroupBy(s => s.SubjectId).Select(g => g.First());
                foreach (var subject in subjects)
                {
                    await CreateChatsIfNotExist(subject.Subject);
                    groupChats.AddRange(await _repository.GroupChats.GetForLecturer(subject.SubjectId));
                }
            }
            else
            {
                var student = await _repository.Students.GetStudentAsync(userId, false);
                var subjects = (await _repository.SubjectGroup.GetSubjects(student.GroupId)).GroupBy(s => s.SubjectId).Select(g => g.First());
                foreach (var subject in subjects)
                {
                    await CreateChatsIfNotExist(subject.Subject);
                    groupChats.AddRange(await _repository.GroupChats.GetForStudents(student.GroupId, subject.SubjectId));
                }
            }
            foreach (var groupChat in groupChats)
            {
                if (groupChat.IsSubjectGroup)
                {
                    var lastReadSubject = await _repository.GroupChatHistoryRepository.GetGroupChatHistoryAsync(userId, groupChat.Id, false);

                    var subjectDto = new SubjectChatsDto() { Id = groupChat.Id, Name = groupChat.GroupName, ShortName = groupChat.ShortName, Color = groupChat.Subject.Color };

                    GroupChat[] groupsModel = groupChats.FindAll(x => !x.IsSubjectGroup && x.SubjectId == groupChat.SubjectId).ToArray();
                    List<GroupChatDto> groupChatsDto = new List<GroupChatDto>();

                    if (lastReadSubject != null)
                        subjectDto.Unread = groupChat.GroupMessages.Count(x => x.Time > lastReadSubject.Date);
                    else
                        subjectDto.Unread = groupChat.GroupMessages.Count;

                    for (int i = 0; i < groupsModel.Length; i++)
                    {
                        var groupChatDto = _mapper.Map<GroupChatDto>(groupsModel[i]);

                        lastReadSubject = await _repository.GroupChatHistoryRepository.GetGroupChatHistoryAsync(userId, groupsModel[i].Id, false);

                        if (lastReadSubject != null)
                            groupChatDto.Unread = groupsModel[i].GroupMessages.Count(x => x.Time > lastReadSubject.Date);
                        else
                            groupChatDto.Unread = groupsModel[i].GroupMessages.Count;

                        groupChatsDto.Add(groupChatDto);
                    }

                    subjectDto.Groups = groupChatsDto;
                    subjectChats.Add(subjectDto);
                }
            }
            return subjectChats;
        }

        private async Task CreateChatsIfNotExist(Subject subject)
        {
            if (subject == null)
                return;

            bool subjectChatExists = await _repository.GroupChats.SubjectChatExists(subject.Id);
            if (!subjectChatExists)
            {
                // Create shared chat
                await _repository.GroupChats.CreateChat(new GroupChat()
                {
                    SubjectId = subject.Id,
                    IsSubjectGroup = true,
                    IsStudentGroup = false,
                    GroupName = subject.Name,
                    ShortName = subject.ShortName
                });
            }

            var subjectGroups = await _repository.SubjectGroup.GetGroups(subject.Id);

            foreach (var sg in subjectGroups)
            {
                bool groupChatExists = await _repository.GroupChats.GroupChatExists(subject.Id, sg.GroupId);
                if (!groupChatExists)
                {
                    // Create group chat
                    string groupName = $"{sg.Group.Name}";
                    string shortName = $"{subject.ShortName} ({sg.Group.Name})";
                    await _repository.GroupChats.CreateChat(new GroupChat()
                    {
                        SubjectId = subject.Id,
                        GroupId = sg.GroupId,
                        GroupName = groupName,
                        ShortName = shortName,
                        IsStudentGroup = true,
                        IsSubjectGroup = false,
                    });
                }
            }
        }
    }
}
