using System.Collections.Generic;
using System.Linq;
using Application.Core.Data;
using Application.Infrastructure.BugManagement;
using Application.Infrastructure.ProjectManagement;
using LMPlatform.Data.Infrastructure;
using LMPlatform.Data.Repositories;
using LMPlatform.Models;

namespace LMPlatform.UI.ViewModels.BTSViewModels
{
    public class BugsViewModel
    {
        private static readonly LmPlatformModelsContext context = new LmPlatformModelsContext();

        public BugsViewModel(int id)
        {
            var model = new BugManagementService().GetBug(id);
            this.BugId = id;
            this.SetParams(model);
        }

        public int ProjectId { get; set; }

        public string ReporterName { get; set; }

        public string Summary { get; set; }

        public string Description { get; set; }

        public string Steps { get; set; }

        public string ExpectedResult { get; set; }

        public string Severity { get; set; }

        public string Status { get; set; }

        public string Symptom { get; set; }

        public string Project { get; set; }

        public string ReportingDate { get; set; }

        public string ModifyingDate { get; set; }

        public string EditorName { get; set; }

        public string AssignedDeveloperName { get; set; }

        public int SymptomId { get; set; }

        public int SeverityId { get; set; }

        public int StatusId { get; set; }

        public int ReporterId { get; set; }

        public int EditorId { get; set; }

        public int AssignedDeveloperId { get; set; }

        public int BugId { get; set; }

        public void SetParams(Bug model)
        {
            var context = new ProjectManagementService();

            this.Steps = model.Steps;
            this.ExpectedResult = model.ExpectedResult;
            this.Symptom = GetSymptomName(model.SymptomId);
            this.EditorName = context.GetCreatorName(model.EditorId);
            this.ReporterName = context.GetCreatorName(model.ReporterId);
            this.Summary = model.Summary;
            this.Description = model.Description;
            this.Severity = GetSeverityName(model.SeverityId);
            this.Status = this.GetStatusName(model.StatusId);
            this.Project = GetProjectTitle(model.ProjectId);
            this.ProjectId = model.ProjectId;
            this.ModifyingDate = model.ModifyingDate.ToShortDateString();
            this.ReportingDate = model.ReportingDate.ToShortDateString();
            this.AssignedDeveloperId = model.AssignedDeveloperId;
            this.AssignedDeveloperName =
                this.AssignedDeveloperId == 0 ? "-" : context.GetCreatorName(this.AssignedDeveloperId);
        }

        public static string GetProjectTitle(int id)
        {
            var projectManagementService = new ProjectManagementService();
            var project = projectManagementService.GetProject(id);
            return project.Title;
        }

        public static string GetReporterName(int id)
        {
            var context = new LmPlatformRepositoriesContainer();
            var user = context.UsersRepository.GetBy(new Query<User>(e => e.Id == id));
            return user.FullName;
        }

        public string GetStatusName(int id)
        {
            var status = context.BugStatuses.Find(id);
            return status.Name;
        }

        public static string GetSeverityName(int id)
        {
            var severity = context.BugSeverities.Find(id);
            return severity.Name;
        }

        public static string GetSymptomName(int id)
        {
            var symptom = context.BugSymptoms.Find(id);
            return symptom.Name;
        }

        public List<BugLog> GetBugLogs()
        {
            var bugLogList = new BugManagementService().GetBugLogs(this.BugId).ToList();
            bugLogList.Reverse(0, bugLogList.Count);

            return bugLogList;
        }
    }
}