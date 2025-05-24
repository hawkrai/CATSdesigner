using Contracts.Repositories;
using Entities;
using Entities.DTO;
using Entities.Models;
using Microsoft.EntityFrameworkCore;
using System;
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

        public async Task<Lecturer> GetLecturerAsync(int lecturerId, bool trackChanges) => 
            await FindByCondition(c => c.Id.Equals(lecturerId), trackChanges).FirstOrDefaultAsync();

        public async Task<IEnumerable<UserDto>> GetLecturersAsync(bool trackChanges, int limit, int offset, string filter) => 
            await FindByCondition(l =>
                l.IsActive &&
                ((l.MiddleName + l.FirstName + l.LastName).Contains(filter) || filter == "*"),
                trackChanges)
            .Join(RepositoryContext.Users,
                l => l.Id,
                u => u.UserId,
                (l, u) => new UserDto()
                {
                    isOnline = u.IsOnline ?? false,
                    UserId = l.Id,
                    FullName = l.LastName + " " + l.FirstName + " " + l.MiddleName,
                    Profile = u.Avatar
                })
            .OrderBy(_ => _.FullName)
            .Skip(offset)
            .Take(limit)
            .ToListAsync();
    }
}
