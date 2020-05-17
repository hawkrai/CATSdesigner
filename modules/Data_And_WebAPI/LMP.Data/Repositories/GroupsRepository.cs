using Application.Core.Data;
using LMP.Data.Infrastructure;
using LMP.Data.Repositories.RepositoryContracts;
using LMP.Models;

namespace LMP.Data.Repositories
{
    public class GroupsRepository : RepositoryBase<LmPlatformModelsContext, Group>, IGroupsRepository
    {
        public GroupsRepository(LmPlatformModelsContext dataContext)
            : base(dataContext)
        {
        }
    }
}