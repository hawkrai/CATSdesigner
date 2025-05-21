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
    public class StudentRepository : RepositoryBase<Student>, IStudentRepository
    {
        public StudentRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }

        public async Task<Student> GetStudentAsync(int studentId, bool trackChanges) => 
            await FindByCondition(c => c.UserId.Equals(studentId), trackChanges)
            .FirstOrDefaultAsync();

        public async Task<IEnumerable<UserDto>> GetStudentsAsync(bool trackChanges, int limit, int offset, string filter) => 
            await FindByCondition(s => 
                s.IsActive && (s.Confirmed == true || (s.Confirmed == null && s.DeletedOn == null)) && 
                ((s.MiddleName + s.FirstName + s.LastName).Contains(filter) || filter == "*"),
                trackChanges)
            .Join(RepositoryContext.Users,
                s => s.UserId,
                u => u.UserId,
                (s, u) => new UserDto()
                {
                    UserId = s.UserId,
                    GroupId = s.GroupId,
                    isOnline = u.IsOnline ?? false,
                    FullName = s.LastName + " " + s.FirstName + " " + s.MiddleName,
                    Profile = u.Avatar
                })
            .OrderBy(user => user.FullName)
            .Skip(offset)
            .Take(limit)
            .ToListAsync();

        public async Task<IEnumerable<Student>> GetStudentsByGroup(int groupId, bool trackChanges) => 
            await FindByCondition(s => 
                s.GroupId == groupId &&
                s.IsActive && (s.Confirmed == true || (s.Confirmed == null && s.DeletedOn == null)),
                trackChanges)
            .OrderBy(s => s.LastName).ThenBy(s => s.FirstName).ThenBy(s => s.MiddleName)
            .ToListAsync();
    }
}
