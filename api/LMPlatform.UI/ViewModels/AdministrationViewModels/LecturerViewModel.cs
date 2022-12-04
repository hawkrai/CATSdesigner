using System.ComponentModel;
using System.Web;
using LMPlatform.Models;

namespace LMPlatform.UI.ViewModels.AdministrationViewModels
{
    using System.Linq;
    using Application.Core;
    using Application.Core.UI.HtmlHelpers;
    using Application.Infrastructure.SubjectManagement;

    public class LecturerViewModel : BaseNumberedGridItem

    {
        static public ISubjectManagementService SubjectManagementService =>
            UnityWrapper.Resolve<ISubjectManagementService>();

        [DisplayName("Полное имя")]
        public string FullName => $"{this.LastName} {this.FirstName} {this.MiddleName}";

        [DisplayName("Логин")]
        public string Login { get; set; }

        [DisplayName("Последний вход")]
        public string LastLogin { get; set; }

        [DisplayName("Предметы")]
        public string Subjects { get; set; }

        [DisplayName("Статус")]
        public bool IsActive { get; set; }

        public bool IsSecretary { get; set; }

        public bool IsLecturerHasGraduateStudents { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string MiddleName { get; set; }

        [DisplayName("Действие")]
        public HtmlString HtmlLinks { get; set; }

        public int Id { get; set; }

        public int[] SecretaryGroupsIds { get; set; }

        public string OwnSubjectsNumber { get; set; }
        public string AttachedSubjectsNumber { get; set; }

        public static LecturerViewModel FormLecturers(Lecturer lecturer, string htmlLinks)
        {
            var subjects = SubjectManagementService.GetSubjectsByLector(lecturer.Id);
            var subjectsCount = subjects.Count();
            var ownSubjectsCount = subjects.Where(s => 
                s.SubjectLecturers.Any(sl => sl.Owner == lecturer.Id) ||
                s.SubjectLecturers.All(sl => sl.Owner == null)
            ).Count();
            
            return new LecturerViewModel
			{
				Id = lecturer.Id,
				FirstName = lecturer.FirstName,
				LastName = lecturer.LastName,
				MiddleName = lecturer.MiddleName,
				Login = lecturer.User.UserName,
				HtmlLinks = new HtmlString(htmlLinks),
				IsActive = lecturer.IsActive,
				LastLogin = lecturer.User.LastLogin.HasValue ? lecturer.User.LastLogin?.ToString("o") : "-",
				Subjects = subjectsCount.ToString() ,
				OwnSubjectsNumber = ownSubjectsCount.ToString(),
				AttachedSubjectsNumber = (subjectsCount - ownSubjectsCount).ToString(),
				IsSecretary = lecturer.IsSecretary,
				IsLecturerHasGraduateStudents = lecturer.IsLecturerHasGraduateStudents,
                SecretaryGroupsIds = lecturer.SecretaryGroups.Select(sg => sg.Id).ToArray()
            };
        }
    }
}