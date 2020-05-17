using System.Linq;
using Application.Core.Data;
using LMP.Data.Infrastructure;
using LMP.Data.Repositories.RepositoryContracts;
using LMP.Models;

namespace LMP.Data.Repositories
{
    public class BugLogsRepository : RepositoryBase<LmPlatformModelsContext, BugLog>, IBugLogsRepository
    {
        public BugLogsRepository(LmPlatformModelsContext dataContext) : base(dataContext)
        {
        }

        public void DeleteBugLog(BugLog bugLog)
        {
            using (var context = new LmPlatformModelsContext())
            {
                var model = context.Set<BugLog>().FirstOrDefault(e => e.Id == bugLog.Id);
                context.Delete(model);

                context.SaveChanges();
            }
        }
    }
}
