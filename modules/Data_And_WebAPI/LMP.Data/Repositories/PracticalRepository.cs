using Application.Core.Data;
using LMP.Data.Infrastructure;
using LMP.Data.Repositories.RepositoryContracts;
using LMP.Models;

namespace LMP.Data.Repositories
{
    public class PracticalRepository : RepositoryBase<LmPlatformModelsContext, Practical>, IPracticalRepository
    {
        public PracticalRepository(LmPlatformModelsContext dataContext)
            : base(dataContext)
        {
        }
    }
}