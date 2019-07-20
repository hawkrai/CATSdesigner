using System.Linq;
using Application.Core.Data;
using LMP.Data.Infrastructure;
using LMP.Data.Repositories.RepositoryContracts;
using LMP.Models;

namespace LMP.Data.Repositories
{
    public class ProjectUsersRepository : RepositoryBase<LmPlatformModelsContext, ProjectUser>, IProjectUsersRepository
    {
        public ProjectUsersRepository(LmPlatformModelsContext dataContext) : base(dataContext)
        {
        }

        public void DeleteProjectUser(ProjectUser projectUser)
        {
            using (var context = new LmPlatformModelsContext())
            {
                var model = context.Set<ProjectUser>().FirstOrDefault(e => e.Id == projectUser.Id);
                context.Delete(model);

                context.SaveChanges();
            }
        }
    }
}
