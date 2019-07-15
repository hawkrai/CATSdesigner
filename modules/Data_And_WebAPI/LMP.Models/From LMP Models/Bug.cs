using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using LMP.Models.From_App_Core_Data;
using LMP.Models.From_LMP_Models.BTS;

namespace LMP.Models.From_LMP_Models
{
    public class Bug : ModelBase
    {
        public int ProjectId { get; set; }

        //PROBLEM
        [Display(Name = "Кем добавлена")] public User Reporter { get; set; }

        //PROBLEM
        [Display(Name = "Название")] public string Summary { get; set; }

        //PROBLEM
        [DataType(DataType.MultilineText)]
        [Display(Name = "Описание")]
        public string Description { get; set; }

        //PROBLEM
        [DataType(DataType.MultilineText)]
        [Display(Name = "Шаги выполнения")]
        public string Steps { get; set; }

        //PROBLEM
        [DataType(DataType.MultilineText)]
        [Display(Name = "Ожидаемый результат")]
        public string ExpectedResult { get; set; }

        //PROBLEM
        [Display(Name = "Дата документирования")]
        public DateTime ReportingDate { get; set; }

        //PROBLEM
        [Display(Name = "Дата последнего изменения")]
        public DateTime ModifyingDate { get; set; }

        //PROBLEM
        [Display(Name = "Симптом")] public int SymptomId { get; set; }

        //PROBLEM
        [Display(Name = "Важность")] public int SeverityId { get; set; }

        //PROBLEM
        [Display(Name = "Статус")] public int StatusId { get; set; }

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