using Application.Core.Data;
using LMP.Data.Infrastructure;
using LMP.Data.Repositories.RepositoryContracts;
using LMP.Models.BTS;

namespace LMP.Data.Repositories
{
    //public class ProjectMatrixRequirementsRepository : RepositoryBase<LmPlatformModelsContext, ProjectMatrixRequirement>, IProjectMatrixRequirementsRepository
    //{

    //    public ProjectMatrixRequirementsRepository(LmPlatformModelsContext dataContext)
    //        : base(dataContext)
    //    {
    //    }

    //    public void DeleteAll(int projectId)
    //    {
    //        var records = DataContext.ProjectMatrixRequirements.Where(e => e.ProjectId == projectId).ToList();
    //        foreach(var record in records)
    //        {
    //            DataContext.ProjectMatrixRequirements.Remove(record);
    //        }
    //        DataContext.SaveChanges();
    //    }

    //    public void UpdateCoveredWhere(Query<ProjectMatrixRequirement> query)
    //    {
    //        var records = GetAll(query);
    //        foreach (var record in records)
    //        {
    //            record.Covered = true;
    //        }
    //        DataContext.SaveChanges();
    //    }
    //}
}
