using Application.Core.Data;
using LMP.Data.Infrastructure;
using LMP.Models.KnowledgeTesting;

namespace LMP.Data.Repositories.RepositoryContracts
{
    class TestQuestionPassResultsRepository : RepositoryBase<LmPlatformModelsContext, TestQuestionPassResults>, ITestQuestionPassResultsRepository
    {
        public TestQuestionPassResultsRepository(LmPlatformModelsContext dataContext) : base(dataContext)
        {
        }

        public void Create(TestQuestionPassResults item)
        {
            using (var context = new LmPlatformModelsContext())
            {
                context.TestQuestionPassResults.Add(item);
            }
        }
    }
}
