using Application.Core.Data;
using LMP.Models.KnowledgeTesting;

namespace LMP.Data.Repositories.RepositoryContracts
{
    public interface ITestQuestionPassResultsRepository : IRepositoryBase<TestQuestionPassResults>
    {
        void Create(TestQuestionPassResults item);
    }
}
