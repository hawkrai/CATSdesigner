using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using LMP.Models.BTS;
using LMP.Models.Interface;

namespace LMP.Models
{
    public class Bug : ModelBase
    {
        public int ProjectId { get; set; }

        public User Reporter { get; set; }

        public string Summary { get; set; }

        public string Description { get; set; }

        public string Steps { get; set; }

        public string ExpectedResult { get; set; }

        public DateTime ReportingDate { get; set; }

        public DateTime ModifyingDate { get; set; }

        public int SymptomId { get; set; }

        public int SeverityId { get; set; }

        public int StatusId { get; set; }

        public int ReporterId { get; set; }

        public int EditorId { get; set; }

        public int AssignedDeveloperId { get; set; }

        public User AssignedDeveloper { get; set; }

        public Project Project { get; set; }

        public BugSymptom Symptom { get; set; }

        public BugSeverity Severity { get; set; }

        public BugStatus Status { get; set; }

        public string Attachments { get; set; }

        public ICollection<BugLog> BugLogs { get; set; }
    }
}