using Application.Core.Data;
using LMP.Models;

namespace LMP.Data.Repositories.RepositoryContracts
{
    public interface IBugLogsRepository : IRepositoryBase<BugLog>
    {
        void DeleteBugLog(BugLog bugLog);
    }
}
