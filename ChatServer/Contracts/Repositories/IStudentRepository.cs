using Entities.DTO;
using Entities.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.Repositories
{
    public interface IStudentRepository
    {
        Task<IEnumerable<UserDto>> GetStudentsAsync(bool trackChanges,string filter="");
        Task<Student> GetStudentAsync(int studentId, bool trackChanges);
        Task<IEnumerable<Student>> GetStudentsByGroup(int groupId, bool trackChanges);
    }
}
