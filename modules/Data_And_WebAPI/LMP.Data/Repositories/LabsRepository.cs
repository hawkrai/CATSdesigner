using Application.Core.Data;
using LMP.Data.Infrastructure;
using LMP.Data.Repositories.RepositoryContracts;
using LMP.Models;

namespace LMP.Data.Repositories
{
    public class LabsRepository : RepositoryBase<LmPlatformModelsContext, Labs>, ILabsRepository
    {
        public LabsRepository(LmPlatformModelsContext dataContext)
            : base(dataContext)
        {
        }
    }
}