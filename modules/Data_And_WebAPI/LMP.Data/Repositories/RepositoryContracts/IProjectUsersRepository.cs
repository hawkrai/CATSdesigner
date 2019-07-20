using Application.Core.Data;
using LMP.Models;

namespace LMP.Data.Repositories.RepositoryContracts
{
    public interface IProjectUsersRepository : IRepositoryBase<ProjectUser>
    {
        void DeleteProjectUser(ProjectUser projectUser);
    }
}
