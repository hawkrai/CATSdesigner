using System.Collections.Generic;

namespace Application.Infrastructure.DTO
{
    public class UserData
    {
        public int UserId { get; set; }

        public bool IsStudent { get; set; }
        
        public bool IsLecturer { get; set; }
        
        public bool IsSecretary { get; set; }

        public bool HasChosenDiplomProject { get; set; }

        public bool HasAssignedDiplomProject { get; set; }

        public bool IsLecturerHasGraduateStudents { get; set; }
        public bool IsGraduate { get; set; }
        public IEnumerable<int> SelectedGroupIds { get; set; }
        public List<int> LecturerGroupIds { get; set; }
        public int StudentGroupId { get; set; }
    }
}
