using System;
using LMPlatform.Models.CP;

namespace LMPlatform.UI.ViewModels.CPViewModels
{
    public class AssignedCourseProjectViewModel
    {
        public int Id { get; set; }

        public int StudentId { get; set; }

        public int CourseProjectId { get; set; }

        public DateTime? ApproveDate { get; set; }

        public int? Mark { get; set; }

        public DateTime? MarkDate { get; set; }

        public string Comment { get; set; }

        public string LecturerName { get; set; }


        public AssignedCourseProjectViewModel(AssignedCourseProject assignedProject) 
        {
            Id = assignedProject.Id;
            StudentId = assignedProject.StudentId;
            CourseProjectId = assignedProject.CourseProjectId;
            ApproveDate = assignedProject.ApproveDate;
            Mark = assignedProject.Mark;
            MarkDate = assignedProject.MarkDate;
            Comment = assignedProject.Comment;
            LecturerName = assignedProject.LecturerName;
        }
    }
}