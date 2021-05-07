using LMPlatform.Models;
using System.Linq;

namespace LMPlatform.UI.ViewModels.SubjectViewModels
{
    public class SubjectViewModel
    {
        public SubjectViewModel()
        {
        }

        public SubjectViewModel(Subject model)
        {
            SubjectId = model.Id;
            DisplayName = model.Name;
            Name = model.ShortName;
            Groups = model.SubjectGroups.Count;
            Students = model.SubjectGroups.Sum(x => x.SubjectStudents.Count);
        }

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

        public int Groups { get; set; }

        public int Students { get; set; }
    }
}