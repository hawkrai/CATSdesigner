using System.Web;
using Application.Core.UI.HtmlHelpers;
using Application.Infrastructure.ProjectManagement;

namespace LMPlatform.UI.ViewModels.BTSViewModels
{
    public class BugListViewModel : BaseNumberedGridItem
    {
        public BugListViewModel()
        {
        }

        public BugListViewModel(int id)
        {
            this.CurrentProjectId = id;
            this.CurrentProjectName = string.Empty;
            if (id != 0)
            {
                var project = new ProjectManagementService().GetProject(id);
                this.CurrentProjectName = project.Title;
            }
        }

        public int Id { get; set; }

        public string Summary { get; set; }

        public string Severity { get; set; }

        public string Status { get; set; }

        public string AssignedDeveloperName { get; set; }

        public string Project { get; set; }

        public string ModifyingDate { get; set; }

        public HtmlString Action { get; set; }

        public string Steps { get; set; }

        public string Symptom { get; set; }

        public string ReporterName { get; set; }

        public string ReportingDate { get; set; }

        public string AssignedDeveloperId { get; set; }

        public int ProjectId { get; set; }

        public int StatusId { get; set; }

        public int CurrentProjectId { get; set; }

        public string CurrentProjectName { get; set; }

        public bool IsAssigned { get; set; }
    }
}