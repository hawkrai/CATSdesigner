using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Web;
using System.Web.Mvc;
using Application.Core;
using Application.Infrastructure.GroupManagement;
using LMPlatform.Models;
using LMPlatform.UI.Attributes;

namespace LMPlatform.UI.ViewModels.AdministrationViewModels
{
    using System.Linq;

    using Application.Core.UI.HtmlHelpers;
    using Application.Infrastructure.ElasticManagement;

    public class GroupViewModel : BaseNumberedGridItem
    {
        private readonly LazyDependency<IGroupManagementService> _groupManagementService = new LazyDependency<IGroupManagementService>();
        private readonly LazyDependency<IElasticManagementService> _elasticManagementService = new LazyDependency<IElasticManagementService>();

        private IGroupManagementService GroupManagementService => _groupManagementService.Value;
        private IElasticManagementService ElasticManagementService => _elasticManagementService.Value;

        [DisplayName("Номер")]
        [MaxLength(10, ErrorMessage = "Длина поля Номер группы не должна превышать 10 символов")]
        [Required(ErrorMessage = "Поле Номер обязательно для заполнения")]
        public string Name { get; set; }

        [DisplayName("Год поступления")]
        [Required(ErrorMessage = "Поле Год поступления обязательно для заполнения")]
        public string StartYear { get; set; }

        [DisplayName("Год выпуска")]
        [Required(ErrorMessage = "Поле Год выпуска обязательно для заполнения")]
        [GreaterThan("StartYear", ErrorMessage = "Значение поля Год выпуска должен быть больше Года поступления")]
        public string GraduationYear { get; set; }

        [DisplayName("Количество студентов")]
        public int StudentsCount { get; set; }

        [DisplayName("Действие")]
        public HtmlString HtmlLinks { get; set; }
        public int StudentsConfirmedCount { get; set; }
        public int StudentsNotConfirmedCount { get; set; }
        public int StudentsDeletedCount {  get; set; }
        public int SubjectsActiveCount { get; set; }
        public int SubjectsNotActiveCount { get; set; }
        public int SubjectsCount { get; set; }
        public int OccupiedBySecretary { get; set; }
        public bool IsOldGroup { get; set; }

        public int Id { get; set; }

        public GroupViewModel()
        {
        }

        public GroupViewModel(Group group)
        {
            Id = group.Id;
            Name = group.Name;
            StartYear = group.StartYear;
            GraduationYear = group.GraduationYear;
        }

        public IList<SelectListItem> GetYears()
        {
            var actualYear = DateTime.Now.Year;
            var yearsList = new List<SelectListItem>();

            for (int year = actualYear - 10; year < actualYear + 10; year++)
            {
                yearsList.Add(new SelectListItem()
                    {
                        Text = year.ToString(),
                        Value = year.ToString(),
                    });
            }

            return yearsList;
        }

        public static GroupViewModel FormGroup(Group group, string htmlLinks)
        {
            return new GroupViewModel
            {
                Id = group.Id,
                Name = group.Name,
                StudentsCount = group.Students.Count(),
                StudentsNotConfirmedCount = group.Students.Where(s => s.Confirmed != true && (s.IsActive == true)).Count(),
                StudentsConfirmedCount = group.Students.Where(s => (s.Confirmed == true && (s.IsActive is true))).Count(),
                StudentsDeletedCount = group.Students.Where(s => (s.DeletedOn != null && s.IsActive is false)).Count(),
                SubjectsActiveCount = group.SubjectGroups.Where(s => (s.Subject == null || !s.Subject.IsArchive) && s.IsActiveOnCurrentGroup).Count(),
                SubjectsNotActiveCount = group.SubjectGroups.Where(s => (s.Subject == null || !s.Subject.IsArchive) && !s.IsActiveOnCurrentGroup).Count(),
                SubjectsCount = group.SubjectGroups.Count(),
                StartYear = group.StartYear,
                GraduationYear = group.GraduationYear,
                OccupiedBySecretary = group.SecretaryId.HasValue ? group.SecretaryId.Value : 0,
                IsOldGroup = group.Students.Where(s => s.Confirmed is null).Count() > 0 || group.Students.Count() == 0 ? true : false,
                HtmlLinks = new HtmlString(htmlLinks)
            };
        }

        public void AddGroup()
        {
            Group group = GetGroupFromViewModel();
            GroupManagementService.AddGroup(group);
            ElasticManagementService.AddGroup(group);
        }

        public void ModifyGroup()
        {
            Group group = new Group()
            {
                Id = Id,
                Name = Name,
                GraduationYear = GraduationYear,
                StartYear = StartYear
            };

            GroupManagementService.UpdateGroup(group);
            ElasticManagementService.ModifyGroup(group);            
        }

        public bool CheckGroupName()
        {
            var group = GroupManagementService.GetGroupByName(this.Name);
            return @group == null;
        }

        private Group GetGroupFromViewModel()
        {
            return new Group()
              {
                  Name = Name,
                  GraduationYear = GraduationYear,
                  StartYear = StartYear
              };
        }
    }
}