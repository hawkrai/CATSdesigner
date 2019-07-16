using Application.Core.Data;
using LMP.Data.Infrastructure;
using LMP.Data.Repositories.RepositoryContracts;
using LMP.Models.KnowledgeTesting;

namespace LMP.Data.Repositories
{
    public class TestUnlockRepository : RepositoryBase<LmPlatformModelsContext, TestUnlock>, ITestUnlocksRepository
    {
        public TestUnlockRepository(LmPlatformModelsContext dataContext) : base(dataContext)
        {
        }
    }
}
