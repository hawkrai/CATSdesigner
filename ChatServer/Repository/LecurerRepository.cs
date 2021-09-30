using Contracts.Repositories;
using Entities;
using Entities.DTO;
using Entities.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Repository
{
    public class LecturerRepository : RepositoryBase<Lecturer>, ILecturerRepository
    {
        public LecturerRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }

        public async Task<Lecturer> GetLecturerAsync(int lecturerId, bool trackChanges) => await FindByCondition(c => c.Id.Equals(lecturerId), trackChanges).FirstOrDefaultAsync();

        public async Task<IEnumerable<UserDto>> GetLecturersAsync(bool trackChanges, string filter = "") => await FindByCondition(c => (c.MiddleName + c.FirstName + c.LastName).Contains(filter) || filter == "*", trackChanges)
            .Join(RepositoryContext.Users,
            x => x.Id,
            y => y.UserId,
            (x, y) => new UserDto()
            {
                isOnline = y.IsOnline?? false,
                UserId = x.Id,
                FullName = x.LastName + " " + x.FirstName + " " + x.MiddleName
            }).OrderBy(_ => _.FullName).ToListAsync();
    }
}
