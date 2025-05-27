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

        public async Task<IEnumerable<SubjectChatsDto>> GetGroups(int userId, bool isLector, bool completedFilter)
        {
            var subjectChatsResult = new List<SubjectChatsDto>();
            var allUserAccessibleSubjects = new List<Subject>();

            if (isLector)
            {
                var lecturerSubjects = await _repository.SubjectLecturer.GetSubjects(userId);
                allUserAccessibleSubjects.AddRange(lecturerSubjects.Select(sl => sl.Subject).Where(s => s != null).DistinctBy(s => s.Id));
            }
            else
            {
                var student = await _repository.Students.GetStudentAsync(userId, false);
                if (student == null) return subjectChatsResult;

                var studentSubjectGroups = await _repository.SubjectGroup.GetSubjects(student.GroupId);
                allUserAccessibleSubjects.AddRange(studentSubjectGroups.Select(sg => sg.Subject).Where(s => s != null).DistinctBy(s => s.Id));
            }

            var allSubjectGroupInfos = new List<SubjectGroup>();
            var subjectIdsForLookup = allUserAccessibleSubjects.Select(s => s.Id).ToList();
            if (subjectIdsForLookup.Any())
            {
                allSubjectGroupInfos = (await _repository.SubjectGroup.GetGroupsBySubjectIds(subjectIdsForLookup)).ToList();
            }


            var allGroupChatsDb = new List<GroupChat>();
            if (subjectIdsForLookup.Any())
            {
                var groupChatsTasks = subjectIdsForLookup.Select(async subjId =>
                {
                    var student = !isLector ? await _repository.Students.GetStudentAsync(userId, false) : null;
                    return isLector
                        ? await _repository.GroupChats.GetForLecturer(subjId)
                        : await _repository.GroupChats.GetForStudents(student?.GroupId ?? 0, subjId);
                });
                var groupChatsCollections = await Task.WhenAll(groupChatsTasks);
                allGroupChatsDb = groupChatsCollections.SelectMany(gc => gc).ToList();
            }


            foreach (var subject in allUserAccessibleSubjects.OrderBy(s => s.ShortName))
            {
                var subjectRelatedChats = allGroupChatsDb
                    .Where(gc => gc.SubjectId == subject.Id)
                    .ToList();

                var subjectChatEntity = subjectRelatedChats.FirstOrDefault(gc => gc.IsSubjectGroup);
                if (subjectChatEntity == null)
                {
                    await CreateChatsIfNotExist(subject, isLector ? null : (await _repository.Students.GetStudentAsync(userId, false))?.GroupId);
                    var studentForRetry = !isLector ? await _repository.Students.GetStudentAsync(userId, false) : null;
                    subjectRelatedChats = (isLector
                        ? await _repository.GroupChats.GetForLecturer(subject.Id)
                        : await _repository.GroupChats.GetForStudents(studentForRetry?.GroupId ?? 0, subject.Id))
                        .ToList();
                    subjectChatEntity = subjectRelatedChats.FirstOrDefault(gc => gc.IsSubjectGroup);
                    if (subjectChatEntity == null) continue;
                }

                var currentSubjectGroupInfos = allSubjectGroupInfos.Where(sgi => sgi.SubjectId == subject.Id).ToList();

                var subjectDto = new SubjectChatsDto
                {
                    Id = subjectChatEntity.Id,
                    Name = subject.Name,
                    ShortName = subject.ShortName,
                    Color = subject.Color,
                    IsArchived = subject.IsArchive,
                    Groups = new List<GroupChatDto>()
                };

                if (isLector)
                {
                    bool hasAnyDetachedGroupForSubject = currentSubjectGroupInfos
                        .Exists(sgi => !(sgi.IsActiveOnCurrentGroup ?? false));

                    subjectDto.IsCompletedForUser = subject.IsArchive || (completedFilter && !subject.IsArchive && hasAnyDetachedGroupForSubject);
                }
                else
                {
                    var student = await _repository.Students.GetStudentAsync(userId, false);
                    var studentSubjGroupInfo = currentSubjectGroupInfos.FirstOrDefault(sgi => sgi.GroupId == student.GroupId);
                    subjectDto.IsCompletedForUser = subject.IsArchive || !(studentSubjGroupInfo?.IsActiveOnCurrentGroup ?? false);
                }

                bool shouldDisplaySubject;
                if (completedFilter)
                {
                    if (isLector)
                    {
                        bool hasAnyDetachedGroupToShow = currentSubjectGroupInfos.Exists(sgi => !(sgi.IsActiveOnCurrentGroup ?? false));
                        shouldDisplaySubject = subjectDto.IsArchived || (!subjectDto.IsArchived && hasAnyDetachedGroupToShow);
                    }
                    else
                    {
                        shouldDisplaySubject = subjectDto.IsCompletedForUser;
                    }
                }
                else
                {
                    if (isLector)
                    {
                        shouldDisplaySubject = !subjectDto.IsArchived;
                    }
                    else
                    {
                        shouldDisplaySubject = !subjectDto.IsCompletedForUser;
                    }
                }

                if (!shouldDisplaySubject) continue;

                var studentGroupChatEntities = subjectRelatedChats.Where(gc => gc.IsStudentGroup).ToList();
                foreach (var groupChatEntity in studentGroupChatEntities.OrderBy(gc => gc.GroupName))
                {
                    var sgInfoForCurrentGroupChat = currentSubjectGroupInfos.FirstOrDefault(sgi => sgi.GroupId == groupChatEntity.GroupId);
                    bool isActiveOnCurrentGroupForChat = sgInfoForCurrentGroupChat?.IsActiveOnCurrentGroup ?? false;

                    var groupChatDto = new GroupChatDto
                    {
                        Id = groupChatEntity.Id,
                        Name = groupChatEntity.GroupName,
                        GroupId = groupChatEntity.GroupId ?? 0,
                        IsActiveOnCurrentGroup = isActiveOnCurrentGroupForChat
                    };

                    if (isLector)
                    {
                        groupChatDto.IsCompletedForUser = subject.IsArchive || !isActiveOnCurrentGroupForChat;
                    }
                    else
                    {
                        groupChatDto.IsCompletedForUser = subjectDto.IsCompletedForUser;
                        var student = await _repository.Students.GetStudentAsync(userId, false);
                        if (groupChatEntity.GroupId != student.GroupId) continue;
                    }

                    if (isLector && completedFilter && !subject.IsArchive && isActiveOnCurrentGroupForChat)
                    {
                        continue;
                    }
                    if (isLector && !completedFilter && !isActiveOnCurrentGroupForChat)
                    {
                        continue;
                    }

                    var lastReadGroup = await _repository.GroupChatHistoryRepository.GetGroupChatHistoryAsync(userId, groupChatEntity.Id, false);
                    var groupMessages = await _repository.GroupMessages.GetGroupMessagesAsync(groupChatEntity.Id, false, int.MaxValue, 0);
                    groupChatDto.Unread = groupMessages.Count(gm => lastReadGroup == null || gm.Time > lastReadGroup.Date);

                    subjectDto.Groups.Add(groupChatDto);
                }

                if (isLector && completedFilter && !subjectDto.IsArchived && !subjectDto.Groups.Any())
                {
                    continue;
                }

                var lastReadSubjectChat = await _repository.GroupChatHistoryRepository.GetGroupChatHistoryAsync(userId, subjectChatEntity.Id, false);
                var subjectChatMessages = await _repository.GroupMessages.GetGroupMessagesAsync(subjectChatEntity.Id, false, int.MaxValue, 0);
                subjectDto.Unread = subjectChatMessages.Count(gm => lastReadSubjectChat == null || gm.Time > lastReadSubjectChat.Date);

                subjectChatsResult.Add(subjectDto);
            }

            return subjectChatsResult;
        }

        private async Task CreateChatsIfNotExist(Subject subject, int? studentGroupId)
        {
            if (subject == null) return;

            if (!await _repository.GroupChats.SubjectChatExists(subject.Id))
            {
                await _repository.GroupChats.CreateChat(new GroupChat()
                {
                    SubjectId = subject.Id,
                    IsSubjectGroup = true,
                    IsStudentGroup = false,
                    GroupName = subject.Name,
                    ShortName = subject.ShortName
                });
            }

            var subjectGroupsInfo = await _repository.SubjectGroup.GetGroups(subject.Id);

            foreach (var sgInfo in subjectGroupsInfo)
            {
                if (studentGroupId.HasValue && sgInfo.GroupId != studentGroupId.Value)
                {
                    continue;
                }

                if (!await _repository.GroupChats.GroupChatExists(subject.Id, sgInfo.GroupId))
                {
                    string groupName = $"{sgInfo.Group.Name}";
                    string shortName = $"{subject.ShortName} ({sgInfo.Group.Name})";
                    await _repository.GroupChats.CreateChat(new GroupChat()
                    {
                        SubjectId = subject.Id,
                        GroupId = sgInfo.GroupId,
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
