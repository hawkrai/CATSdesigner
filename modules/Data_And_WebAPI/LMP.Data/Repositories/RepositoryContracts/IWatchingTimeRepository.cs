using Application.Core.Data;
using LMP.Models;

namespace LMP.Data.Repositories.RepositoryContracts
{
    public interface IWatchingTimeRepository : IRepositoryBase<WatchingTime>
    {
        void Create(WatchingTime item);
        WatchingTime GetByUserConceptIds(int UserId, int conceptId);
    }
}
