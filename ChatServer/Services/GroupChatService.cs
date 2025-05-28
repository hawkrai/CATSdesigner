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
            Student student = null;

            if (isLector)
            {
                var lecturerSubjects = await _repository.SubjectLecturer.GetSubjects(userId);
                allUserAccessibleSubjects.AddRange(lecturerSubjects.Select(sl => sl.Subject).Where(s => s != null).DistinctBy(s => s.Id));
            }
            else
            {
                student = await _repository.Students.GetStudentAsync(userId, false);
                if (student == null) return subjectChatsResult;
                var studentSubjectGroups = await _repository.SubjectGroup.GetSubjects(student.GroupId, true);
                allUserAccessibleSubjects.AddRange(studentSubjectGroups.Select(sg => sg.Subject).Where(s => s != null).DistinctBy(s => s.Id));
            }

            if (!allUserAccessibleSubjects.Any()) return subjectChatsResult;

            var subjectIdsForLookup = allUserAccessibleSubjects.Select(s => s.Id).ToList();

            var allSubjectGroupInfos = (await _repository.SubjectGroup.GetGroupsBySubjectIds(subjectIdsForLookup, true)).ToList();

            var allGroupChatsDbWithDetails = new List<GroupChat>();
            foreach (var subjId in subjectIdsForLookup)
            {
                var chatsForSubject = isLector
                    ? await _repository.GroupChats.GetForLecturer(subjId)
                    : await _repository.GroupChats.GetForStudents(student?.GroupId ?? 0, subjId);
                allGroupChatsDbWithDetails.AddRange(chatsForSubject);
            }

            var relevantChatIds = allGroupChatsDbWithDetails.Select(gc => gc.Id).Distinct().ToList();
            var userChatHistories = new List<GroupChatHistory>();
            if (relevantChatIds.Any())
            {
                foreach (var chatId in relevantChatIds)
                {
                    var history = await _repository.GroupChatHistoryRepository.GetGroupChatHistoryAsync(userId, chatId, false);
                    if (history != null) userChatHistories.Add(history);
                }
            }

            foreach (var subject in allUserAccessibleSubjects.OrderBy(s => s.ShortName))
            {
                var subjectRelatedChatsFromCache = allGroupChatsDbWithDetails
                    .Where(gc => gc.SubjectId == subject.Id)
                    .ToList();

                var subjectChatEntity = subjectRelatedChatsFromCache.FirstOrDefault(gc => gc.IsSubjectGroup);

                if (subjectChatEntity == null)
                {
                    await CreateChatsIfNotExist(subject, isLector ? null : student?.GroupId);
                    var reloadedChatsForSubject = isLector
                        ? await _repository.GroupChats.GetForLecturer(subject.Id)
                        : await _repository.GroupChats.GetForStudents(student?.GroupId ?? 0, subject.Id);

                    allGroupChatsDbWithDetails.RemoveAll(gc => gc.SubjectId == subject.Id);
                    allGroupChatsDbWithDetails.AddRange(reloadedChatsForSubject);
                    subjectRelatedChatsFromCache = reloadedChatsForSubject.ToList();
                    subjectChatEntity = subjectRelatedChatsFromCache.FirstOrDefault(gc => gc.IsSubjectGroup);

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

                bool subjectHasDetachedGroups = false;
                bool subjectHasActiveGroups = false;

                if (isLector)
                {
                    subjectHasDetachedGroups = currentSubjectGroupInfos.Exists(sgi => !(sgi.IsActiveOnCurrentGroup ?? false));
                    subjectHasActiveGroups = currentSubjectGroupInfos.Exists(sgi => sgi.IsActiveOnCurrentGroup ?? false);
                    subjectDto.IsCompletedForUser = subject.IsArchive || completedFilter;
                }
                else
                {
                    var studentSubjGroupInfo = currentSubjectGroupInfos.FirstOrDefault(sgi => sgi.GroupId == student.GroupId);
                    subjectDto.IsCompletedForUser = subject.IsArchive || !(studentSubjGroupInfo?.IsActiveOnCurrentGroup ?? false);
                }

                bool shouldDisplaySubject;
                if (completedFilter)
                {
                    if (isLector)
                    {
                        shouldDisplaySubject = subject.IsArchive || !subjectHasActiveGroups || subjectHasDetachedGroups;
                    }
                    else
                    {
                        shouldDisplaySubject = subjectDto.IsCompletedForUser;
                    }   
                }
                else
                {
                    shouldDisplaySubject = isLector ? !subjectDto.IsArchived && subjectHasActiveGroups : !subjectDto.IsCompletedForUser;
                }

                if (!shouldDisplaySubject) continue;

                var studentGroupChatEntities = subjectRelatedChatsFromCache.Where(gc => gc.IsStudentGroup).ToList();
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

                    groupChatDto.IsCompletedForUser = isLector ? (subject.IsArchive || !isActiveOnCurrentGroupForChat) : subjectDto.IsCompletedForUser;

                    if (isLector)
                    {
                        if (groupChatEntity.SubjectId != subject.Id) continue;
                        if (completedFilter && !groupChatDto.IsCompletedForUser) continue;
                        if (!completedFilter && groupChatDto.IsCompletedForUser) continue;
                    }
                    else
                    {
                        if (groupChatEntity.GroupId != student.GroupId) continue;
                    }

                    var lastReadGroup = userChatHistories.FirstOrDefault(h => h.GroupChatId == groupChatEntity.Id);
                    groupChatDto.Unread = groupChatEntity.GroupMessages?.Count(gm => lastReadGroup == null || gm.Time > lastReadGroup.Date) ?? 0;

                    subjectDto.Groups.Add(groupChatDto);
                }

                if (subjectDto.Groups.Count == 0)
                    continue;

                var lastReadSubjectChat = userChatHistories.FirstOrDefault(h => h.GroupChatId == subjectChatEntity.Id);
                subjectDto.Unread = subjectChatEntity.GroupMessages?.Count(gm => lastReadSubjectChat == null || gm.Time > lastReadSubjectChat.Date) ?? 0;

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
