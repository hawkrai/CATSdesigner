using System.Collections.Generic;
using System.Linq;
using Application.Core.Data;
using LMP.Data.Infrastructure;
using LMP.Data.Repositories.RepositoryContracts;
using LMP.Models;

namespace LMP.Data.Repositories
{
    public class ProjectCommentsRepository : RepositoryBase<LmPlatformModelsContext, ProjectComment>, IProjectCommentsRepository
    {
        public ProjectCommentsRepository(LmPlatformModelsContext dataContext) : base(dataContext)
        {
        }

        public void DeleteComment(ProjectComment comment)
        {
            using (var context = new LmPlatformModelsContext())
            {
                var model = context.Set<ProjectComment>().FirstOrDefault(e => e.Id == comment.Id);
                context.Delete(model);

                context.SaveChanges();
            }
        }

        public List<ProjectComment> GetProjectComments(int projectId)
        {
            using(var context = new LmPlatformModelsContext())
            {
                return context.Set<ProjectComment>()
                    .Where(e => e.ProjectId == projectId)
                    .ToList();
            }
        }
    }
}
