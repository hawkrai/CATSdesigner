using Application.Core.Data;
using LMP.Models;

namespace LMP.Data.Repositories.RepositoryContracts
{
    public interface ILecturerRepository : IRepositoryBase<Lecturer>
    {
        void SaveLecturer(Lecturer lecturer);
        void DeleteLecturer(Lecturer lecturer);
    }
}
