using Contracts.Repositories;
using DocumentFormat.OpenXml.Math;
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

        public async Task<IEnumerable<SubjectLecturer>> GetSubjects(int lecturerId) => 
            await FindByCondition(c => c.LecturerId == lecturerId, false)
            .Include(c => c.Subject)
            .Where(c => !c.Subject.IsArchive)
            .OrderBy(c => c.Subject.ShortName)
            .ToListAsync();

        public async Task<IEnumerable<SubjectLecturer>> GetLecturersBySubjectIds(IEnumerable<int> subjectIds) =>
            await FindByCondition(sl => subjectIds.Contains(sl.SubjectId), false)
            .Include(sl => sl.Subject)
            .Where(sl => !sl.Subject.IsArchive)
            .ToListAsync();
    }
}