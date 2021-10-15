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
    public class StudentRepository : RepositoryBase<Student>,IStudentRepository
    {
        
        public StudentRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }

        public async Task<Student> GetStudentAsync(int studentId, bool trackChanges) => await FindByCondition(c => c.UserId.Equals(studentId), trackChanges).FirstOrDefaultAsync();

        public async Task<IEnumerable<UserDto>> GetStudentsAsync(bool trackChanges, string filter = "") => await FindByCondition(c => (c.MiddleName+c.FirstName+c.LastName).Contains(filter) || filter == "*", trackChanges).Join(RepositoryContext.Users,
            x => x.UserId,
            y => y.UserId,
            (x, y) => new UserDto()
            {
                UserId = x.UserId,
                GroupId = x.GroupId,
                isOnline = y.IsOnline?? false,
                FullName = x.LastName+" "+x.FirstName+" "+x.MiddleName
            }).OrderBy(_ => _.FullName).ToListAsync();

        public async Task<IEnumerable<Student>> GetStudentsByGroup(int groupId, bool trackChanges) => await FindByCondition(_ => _.GroupId == groupId, trackChanges).ToListAsync();
    }
}
