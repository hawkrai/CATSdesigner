namespace LMPlatform.Data.Repositories
{
    using Application.Core.Data;

    using LMPlatform.Data.Infrastructure;
    using LMPlatform.Data.Repositories.RepositoryContracts;
    using LMPlatform.Models;

    public class HiddenTestRepository : RepositoryBase<LmPlatformModelsContext, HiddenTest>, IHiddenTestRepository
    {
        public HiddenTestRepository(LmPlatformModelsContext dataContext)
            : base(dataContext)
        {
        }
    }
}



