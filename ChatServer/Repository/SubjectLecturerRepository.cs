using Contracts.Repositories;
using Entities;
using Entities.Models;
using Entities.Models.GroupChatModels;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Repository
{
    public class SubjectLecturerRepository : RepositoryBase<SubjectLecturer>, ISubjectLecturerRepository
    {
        public SubjectLecturerRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }

        public async Task<IEnumerable<SubjectLecturer>> GetSubjects(int lecturerId) => await FindByCondition(c => c.LecturerId == lecturerId, false).ToListAsync();

    }
}
