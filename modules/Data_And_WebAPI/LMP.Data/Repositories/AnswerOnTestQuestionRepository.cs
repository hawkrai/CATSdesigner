using Application.Core.Data;
using LMP.Data.Infrastructure;
using LMP.Data.Repositories.RepositoryContracts;
using LMP.Models.KnowledgeTesting;

namespace LMP.Data.Repositories
{
    public class AnswerOnTestQuestionRepository : RepositoryBase<LmPlatformModelsContext, AnswerOnTestQuestion>, IAnswerOnTestQuestionRepository
    {
        public AnswerOnTestQuestionRepository(LmPlatformModelsContext dataContext) : base(dataContext)
        {
        }
    }
}
