using LMPlatform.Models;
using System.Linq;

namespace LMPlatform.UI.Helpers 
{
    public static class SubjectLecturerHelper 
    {
        public static string GetAuthorName(Subject subject, int lecturerId) 
        {
            var subjectLecturer = subject.SubjectLecturers.FirstOrDefault(sl => sl.Owner == lecturerId);

            if (subjectLecturer != null) 
            {
                return subjectLecturer.OwnerLecturer.FullName;
            }

            return subject.SubjectLecturers.FirstOrDefault(sl => sl.Owner != null)?.OwnerLecturer?.FullName;
        }
    }
}