using System.Linq;
using Application.Core.Data;
using LMP.Data.Infrastructure;
using LMP.Data.Repositories.RepositoryContracts;
using LMP.Models;

namespace LMP.Data.Repositories
{
    public class ModulesRepository : RepositoryBase<LmPlatformModelsContext, Module>, IModulesRepository
    {
        public ModulesRepository(LmPlatformModelsContext dataContext) : base(dataContext)
        {
        }

        protected override IQueryable<Module> PerformGetAll(IQuery<Module> query, LmPlatformModelsContext dataContext)
        {
            var updatedQuery = query.Include(q=>q.SubjectModules);
            return base.PerformGetAll(updatedQuery, dataContext);
        }
    }
}