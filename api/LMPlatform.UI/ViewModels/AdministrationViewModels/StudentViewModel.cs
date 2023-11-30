using LMPlatform.Models;
using System.ComponentModel;
using System.Web;

namespace LMPlatform.UI.ViewModels.AdministrationViewModels
{
    using Application.Core;
    using Application.Core.UI.HtmlHelpers;
    using Application.Infrastructure.SubjectManagement;

    public class StudentViewModel : BaseNumberedGridItem
    {
        public static ISubjectManagementService SubjectManagementService =>
            UnityWrapper.Resolve<ISubjectManagementService>();

        public int GroupId { get; set; }

        [DisplayName("Номер группы")]
        public string GroupName { get; set; }

        [DisplayName("Полное имя")]
        public string FullName => $"{Surname} {Name} {Patronymic}";

        [DisplayName("Логин")]
        public string UserName { get; set; }

        [DisplayName("Последний вход")]
        public string LastLogin { get; set; }

        [DisplayName("Действие")]
        public HtmlString HtmlLinks { get; set; }

        [DisplayName("Статус")]
        public bool IsActive { get; set; }

        public string? DeletedOn { get; set; }

        public bool? Confirmed { get; set; }

        public string? ConfirmedBy { get; set; }

        public string? ConfirmationDate { get; set; }

        public int Id { get; set; }

        public string Name { get; set; }

        public string Surname { get; set; }

        public string Patronymic { get; set; }

        public int ActiveSubjects { get; set; }
        public int NotActiveSubjects { get; set; }

        public string AddedOn { get; set; }


        public static StudentViewModel FromStudent(Student student, string htmlLinks)
        {
            return new StudentViewModel
            {
                Id = student.Id,
                Name = student.FirstName,
                Surname = student.LastName,
                Patronymic = student.MiddleName,
                GroupId = student.GroupId,
                GroupName = student.Group.Name,
                UserName = student.User.UserName,
                HtmlLinks = new HtmlString(htmlLinks),
                LastLogin = student.User.LastLogin.HasValue ? student.User.LastLogin?.ToString("o") : "-",
                ActiveSubjects = SubjectManagementService.GetSubjectsCountByStudent(student.Id, true),
                NotActiveSubjects = SubjectManagementService.GetSubjectsCountByStudent(student.Id, false),
                IsActive = student.IsActive.HasValue ? student.IsActive.Value : true,
                DeletedOn = student.DeletedOn?.ToString("o"),
                Confirmed = student.Confirmed,
                ConfirmedBy = student.ConfirmedBy?.FullName,
                ConfirmationDate = student.ConfirmedAt?.ToString("o") ?? "-",
                AddedOn = student.User?.AddedOn?.ToString("o") ?? "-"
            };
        }
    }
}