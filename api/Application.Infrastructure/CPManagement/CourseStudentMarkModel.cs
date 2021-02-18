using System;
using System.ComponentModel.DataAnnotations;

namespace Application.Infrastructure.CPManagement
{
    public sealed class CourseStudentMarkModel
    {
        [Range(1, 10)]
        public int Mark { get; set; }

        public int AssignedProjectId { get; set; }

        public DateTime Date { get; set; }

        public string Comment { get; set; }

        public bool ShowForStudent { get; set; }

        [Required(AllowEmptyStrings = false)]
        public string LecturerName { get; set; }
    }
}