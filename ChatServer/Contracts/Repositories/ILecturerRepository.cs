using Entities.DTO;
using Entities.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.Repositories
{
    public interface ILecturerRepository
    {
        Task<IEnumerable<UserDto>> GetLecturersAsync(bool trackChanges, string filter = "");
        Task<Lecturer> GetLecturerAsync(int lecturerId, bool trackChanges);
    }
}
