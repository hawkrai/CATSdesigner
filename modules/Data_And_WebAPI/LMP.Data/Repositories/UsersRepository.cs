using Application.Core.Data;
using LMP.Data.Infrastructure;
using LMP.Data.Repositories.RepositoryContracts;
using LMP.Models;

namespace LMP.Data.Repositories
{
    public class UsersRepository : RepositoryBase<LmPlatformModelsContext, User>, IUsersRepository
    {
        public UsersRepository(LmPlatformModelsContext dataContext) : base(dataContext)
        {
        }
    }
}