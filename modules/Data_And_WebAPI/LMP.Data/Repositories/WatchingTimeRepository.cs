using System.Linq;
using Application.Core.Data;
using LMP.Data.Infrastructure;
using LMP.Data.Repositories.RepositoryContracts;
using LMP.Models;

namespace LMP.Data.Repositories
{
    public class WatchingTimeRepository : RepositoryBase<LmPlatformModelsContext, WatchingTime>, IWatchingTimeRepository
    {
        public WatchingTimeRepository(LmPlatformModelsContext dataContext)
            : base(dataContext)
        {
        }

        public void Create(WatchingTime watchingTime)
        {
            using (var context = new LmPlatformModelsContext())
            {
                context.WatchingTime.Add(watchingTime);
            }
        }

        public WatchingTime GetByUserConceptIds(int UserId, int conceptId)
        {
            using (var context = new LmPlatformModelsContext())
            {
                var watchingTime = context.Set<WatchingTime>().FirstOrDefault(e => e.UserId == UserId & e.ConceptId == conceptId);
                //var watchingTime = context.Set<WatchingTime>().FirstOrDefault(e => e.UserId == UserId & e.Concept.Id == conceptId);
                return watchingTime;
            }
        }
    }
}
