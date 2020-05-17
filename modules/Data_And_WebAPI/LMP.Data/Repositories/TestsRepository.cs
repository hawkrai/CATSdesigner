using Application.Core.Data;
using LMP.Data.Infrastructure;
using LMP.Data.Repositories.RepositoryContracts;
using LMP.Models.KnowledgeTesting;

namespace LMP.Data.Repositories
{
    public class TestsRepository : RepositoryBase<LmPlatformModelsContext, Test>, ITestsRepository
    {
        public TestsRepository(LmPlatformModelsContext dataContext) : base(dataContext)
        {
        }
    }
}
