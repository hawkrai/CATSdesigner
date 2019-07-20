using Application.Core.Data;
using LMP.Models;

namespace LMP.Data.Repositories.RepositoryContracts
{
    public interface IProjectCommentsRepository : IRepositoryBase<ProjectComment>
    {
        void DeleteComment(ProjectComment comment);
    }
}
