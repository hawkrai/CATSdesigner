using Application.Core.Data;
using LMP.Data.Infrastructure;
using LMP.Data.Repositories.RepositoryContracts;
using LMP.Models.KnowledgeTesting;

namespace LMP.Data.Repositories
{
    public class QuestionsRepository : RepositoryBase<LmPlatformModelsContext, Question>, IQuestionsRepository
    {
        public QuestionsRepository(LmPlatformModelsContext dataContext) : base(dataContext)
        {
        }
    }
}
