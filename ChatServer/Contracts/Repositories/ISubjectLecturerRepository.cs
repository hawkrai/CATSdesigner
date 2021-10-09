using Entities.Models.GroupChatModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.Repositories
{
    public interface ISubjectLecturerRepository
    {
        Task<IEnumerable<SubjectLecturer>> GetSubjects(int lecturerId);
    }
}
