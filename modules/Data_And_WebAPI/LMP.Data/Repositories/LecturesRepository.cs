using Application.Core.Data;
using LMP.Data.Infrastructure;
using LMP.Data.Repositories.RepositoryContracts;
using LMP.Models;

namespace LMP.Data.Repositories
{
    public class LecturesRepository : RepositoryBase<LmPlatformModelsContext, Lectures>, ILecturesRepository
    {
        public LecturesRepository(LmPlatformModelsContext dataContext) : base(dataContext)
        {
        }
    }
}