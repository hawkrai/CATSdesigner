using System.Collections.Generic;
using System.Linq;
using Application.Core;
using Application.Infrastructure.StudentManagement;
using Application.Infrastructure.SubjectManagement;
using LMPlatform.Models;
using LMPlatform.UI.ViewModels.AdministrationViewModels;
using LMPlatform.UI.ViewModels.SubjectViewModels;

namespace LMPlatform.UI.ViewModels.LmsViewModels
{
    public class LmsViewModel
    {
        private readonly LazyDependency<IModulesManagementService> _modulesManagementService =
            new LazyDependency<IModulesManagementService>();

        private readonly LazyDependency<IStudentManagementService> _studentManagementService =
            new LazyDependency<IStudentManagementService>();

        private readonly LazyDependency<ISubjectManagementService> _subjectManagementService =
            new LazyDependency<ISubjectManagementService>();

        public LmsViewModel(int userId, bool isLector)
        {
            var s = this.SubjectManagementService.GetUserSubjects(userId).Where(e => !e.IsArchive);
            this.Subjects = s.Select(e => new SubjectViewModel(e, userId)).ToList();
            this.CurrentSubjects = this.Subjects.Count();
            this.TotalSubject = this.SubjectManagementService.GetSubjects().Count();
            this.ComplexSubjects = s
                .Where(cs =>
                    this.ModulesManagementService.GetModules(cs.Id)
                        .Any(m => m.ModuleType == ModuleType.ComplexMaterial))
                .Select(e => new SubjectViewModel(e, userId)).ToList();
            this.CourseProjectSubjects = s.Where(cs =>
                    this.ModulesManagementService.GetModules(cs.Id).Any(m => m.ModuleType == ModuleType.YeManagment))
                .Select(e => new SubjectViewModel(e, userId)).ToList();

            var modelStudents = new List<int>();
            this.CurrentStudents = 0;

            if (isLector)
            {
                this.TotalStudents = this.StudentManagementService.GetStudents().Count();

                foreach (var subjects in this.SubjectManagementService.GetUserSubjects(userId))
                    if (subjects.SubjectGroups != null)
                        foreach (var group in subjects.SubjectGroups)
                        foreach (var student in @group.SubjectStudents)
                            if (modelStudents.All(e => e != student.StudentId))
                            {
                                modelStudents.Add(student.StudentId);
                                this.CurrentStudents += 1;
                            }
            }
        }

        public ISubjectManagementService SubjectManagementService => this._subjectManagementService.Value;

        public IStudentManagementService StudentManagementService => this._studentManagementService.Value;

        public IModulesManagementService ModulesManagementService => this._modulesManagementService.Value;

        public List<SubjectViewModel> Subjects { get; set; }

        public List<SubjectViewModel> ComplexSubjects { get; set; }

        public List<SubjectViewModel> CourseProjectSubjects { get; set; }

        public int TotalSubject { get; set; }

        public int CurrentSubjects { get; set; }

        public int TotalStudents { get; set; }

        public int CurrentStudents { get; set; }

        public UserActivityViewModel UserActivity { get; set; }
    }
}