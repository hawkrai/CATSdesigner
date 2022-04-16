using System.Collections.Generic;
using System.Linq;
using Application.Core;
using Application.Infrastructure.SubjectManagement;
using LMPlatform.Data.Repositories.RepositoryContracts;

namespace LMPlatform.UI.ViewModels.SubjectViewModels
{
    public class SubjectManagementViewModel
    {
        private readonly LazyDependency<ISubjectManagementService> _subjectManagementService = new LazyDependency<ISubjectManagementService>();

        public ISubjectManagementService SubjectManagementService
        {
            get
            {
                return _subjectManagementService.Value;
            }
        }

        public List<SubjectModuleListIetmViewModel> NavList
        {
            get; 
            set;
        }

        public string SubjectName
        {
            get; 
            set;
        }

        public List<SubjectViewModel> Subjects
        {
            get;
            set;
        }

        public SubjectManagementViewModel(int modelId)
        {
            var model = SubjectManagementService.GetSubject(modelId);
            SubjectName = model.Name;
        }

        public SubjectManagementViewModel(string userId)
        {
            var parsedUserId = int.Parse(userId);
            Subjects = SubjectManagementService.GetUserSubjects(parsedUserId).Where(e => !e.IsArchive).Select(e => new SubjectViewModel(e, parsedUserId)).ToList();

			//Subjects = SubjectManagementService.GetSubjectsByLectorOwner(int.Parse(userId)).Where(e => !e.IsArchive).Select(e => new SubjectViewModel(e)).ToList();
        }
    }
}