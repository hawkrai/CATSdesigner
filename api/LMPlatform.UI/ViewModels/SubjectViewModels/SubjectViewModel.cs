using Application.Core.Helpers;
using LMPlatform.Models;
using LMPlatform.UI.Services.Modules.CoreModels;
using System.Collections.Generic;
using System.Linq;

namespace LMPlatform.UI.ViewModels.SubjectViewModels
{
    public class SubjectViewModel
    {
        public SubjectViewModel()
        {
        }

        public SubjectViewModel(Subject model, int userId)
        {
            var subjectGroups = model.SubjectGroups.Where(x => x.IsActiveOnCurrentGroup);
            SubjectId = model.Id;
            DisplayName = model.Name;
            Name = model.ShortName;
            GroupsCount = subjectGroups.Count();
            StudentsCount = subjectGroups.Sum(x => x.SubjectStudents.Count);
            Groups = subjectGroups.Select(x => new GroupsViewData()
            {
                GroupId = x.GroupId,
                GroupName = x.Group.Name,
            }).OrderBy(x => x.GroupName);
            var owner = model.SubjectLecturers.FirstOrDefault(x => x.Owner.HasValue)?.Owner;
            Owner =  owner is null ? model.SubjectLecturers.FirstOrDefault(x => !x.Owner.HasValue).LecturerId : owner;
            Lectors = model.SubjectLecturers.GroupBy(x => x.Id).Select(x => x.First())
                    .Where(x => x.Id != userId)
                    .Select(x => new LectorViewModel(x.Lecturer))
                    .ToList();
        }

        public int? Owner { get; set; }

        public int SubjectId
        {
            get; 
            set;
        }

        public string DisplayName
        {
            get;
            set;
        }

        public string Name
        {
            get; 
            set;
        }

        public int GroupsCount { get; set; }

        public int StudentsCount { get; set; }

        public IEnumerable<GroupsViewData> Groups { get; set; }

        public IEnumerable<LectorViewModel> Lectors { get; set; }

    }
}