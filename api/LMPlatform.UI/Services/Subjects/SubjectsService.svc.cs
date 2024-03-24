using System;
using System.Linq;
using Application.Core;
using Application.Infrastructure.SubjectManagement;
using Application.Core.Data;
using LMPlatform.Models;
using LMPlatform.UI.Services.Modules;
using LMPlatform.UI.Services.Modules.Parental;
using LMPlatform.UI.Attributes;
using LMPlatform.UI.ViewModels.SubjectViewModels;
using System.Collections.Generic;
using Application.Infrastructure.GroupManagement;
using Application.Core.Helpers;

namespace LMPlatform.UI.Services.Subjects
{
    [JwtAuth]
    public class SubjectsService : ISubjectsService
    {
        private readonly LazyDependency<ISubjectManagementService> subjectManagementService = new LazyDependency<ISubjectManagementService>();
        private readonly LazyDependency<IModulesManagementService> modulesManagementService = new LazyDependency<IModulesManagementService>();
        private readonly LazyDependency<IGroupManagementService> groupManagementService = new LazyDependency<IGroupManagementService>();
        public ISubjectManagementService SubjectManagementService => subjectManagementService.Value;
        public IModulesManagementService ModulesManagementService => modulesManagementService.Value;

        public IGroupManagementService GroupManagementService => groupManagementService.Value;

        public SubjectsResult GetSubjectsBySession()
        {
            var subjects = SubjectManagementService.GetUserSubjectsV2(UserContext.CurrentUserId);

            var result = new SubjectsResult
            {
                Subjects = subjects.Select(e => new SubjectViewData(e)).ToList()
            };

            return result;
        }

        public SubjectResult Update(SubjectViewData subject)
        {
            var isUserAssigned = SubjectManagementService.IsUserAssignedToSubjectAndLector(UserContext.CurrentUserId, subject.Id);
            if (!isUserAssigned)
            {
                return new SubjectResult
                {
                    Code = "500",
                    Message = "Пользователь не присоединён к предмету"
                };
            }
            var query = new Query<Subject>(s => s.Id == subject.Id)
		        .Include(s => s.SubjectGroups)
		        .Include(s => s.SubjectModules);
            var loadedSubject = SubjectManagementService.GetSubject(query);
            loadedSubject.IsNeededCopyToBts = subject.IsNeededCopyToBts;
            SubjectManagementService.SaveSubject(loadedSubject);
            return new SubjectResult
            {
                Subject = new SubjectViewData(loadedSubject)
            };
        }

        public IEnumerable<ModulesViewModel> GetSubjectModules(string subjectId)
        {
            var modules = ModulesManagementService.GetModules(int.Parse(subjectId))
                .Where(e => e.Visible)
                .ToList();
            var subjectAttachmentsModule = modules.FirstOrDefault(x => x.ModuleType == ModuleType.SubjectAttachments);
            if (subjectAttachmentsModule != null && 
                !modules.Any(x => x.ModuleType == ModuleType.Labs || x.ModuleType == ModuleType.Lectures || x.ModuleType == ModuleType.Practical))
            {
                modules.Remove(subjectAttachmentsModule);
            }
            var modulesViewModel = modules.Select(m => new ModulesViewModel(m, true));
            return modulesViewModel.OrderBy(m => m.Order);
        }

        public UserAssignedViewData UserAssigned(string subjectId)
        {
            return new UserAssignedViewData
            {
                IsAssigned = SubjectManagementService.IsUserAssignedToSubject(UserContext.CurrentUserId, int.Parse(subjectId))
            };
        }

        public LectorResult GetSubjectOwner(string subjectId)
        {
            try
            {
                var lectorOwner = SubjectManagementService.GetSubjectOwner(int.Parse(subjectId));
                return new LectorResult
                {
                    Code = "200",
                    Lector = new LectorViewData(lectorOwner, true),
                    Message = "Владелец предмета успешно получен"
                };
            } catch
            {
                return new LectorResult
                {
                    Code = "500",
                    Message = "Не удалось получить владельца предмета"
                };
            }

        }

        public SubjectsResult GetUserSubjects()
        {
            var subjects = SubjectManagementService.GetUserSubjectsV2(UserContext.CurrentUserId);
            var subjectsResponse = new List<SubjectViewData>();
            foreach(var subject in subjects)
            {
                var subjectViewData = new SubjectViewData(subject);
                subjectViewData.Lector = new LectorViewData(SubjectManagementService.GetSubjectOwner(subject.Id));
                subjectsResponse.Add(subjectViewData);
            }
            var result = new SubjectsResult
            {
                Subjects = subjectsResponse.OrderBy(x => x.Name).ToList()
            };

            return result;
        }

        public UniqueViewData IsSubjectNameUnique(string subjectName, int subjectId)
        {
            var subjects = SubjectManagementService.GetSubjects(new Query<Subject>(x => x.Id != subjectId && x.Name.ToLower() == subjectName.ToLower())).ToList();

            return new UniqueViewData { IsUnique = !subjects.Any() };
        }

        public UniqueViewData IsSubjectAbbreviationUnique(string subjectAbbreviation, int subjectId)
        {
            var subjects = SubjectManagementService.GetSubjects(new Query<Subject>(x => x.Id != subjectId && x.ShortName.ToLower() == subjectAbbreviation.ToLower())).ToList();

            return new UniqueViewData { IsUnique = !subjects.Any() };
        }

        public IEnumerable<ModulesViewModel> GetSubjectModulesForSchedule(string subjectId)
        {
            var modules = ModulesManagementService.GetModules(int.Parse(subjectId))
                .Where(e => e.ModuleType == ModuleType.Lectures || e.ModuleType == ModuleType.Practical || e.ModuleType == ModuleType.Labs || e.ModuleType == ModuleType.YeManagment)
                .ToList();
            var modulesViewModel = modules.Select(m => new ModulesViewModel(m, true));

            return modulesViewModel.OrderBy(m => m.Order);
        }
    }
}
