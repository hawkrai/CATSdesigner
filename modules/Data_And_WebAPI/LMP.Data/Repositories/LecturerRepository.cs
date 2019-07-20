using System.Linq;
using Application.Core.Data;
using LMP.Data.Infrastructure;
using LMP.Data.Repositories.RepositoryContracts;
using LMP.Models;

namespace LMP.Data.Repositories
{
    public class LecturerRepository : RepositoryBase<LmPlatformModelsContext, Lecturer>, ILecturerRepository
    {
        public LecturerRepository(LmPlatformModelsContext dataContext)
            : base(dataContext)
        {
        }

        public void SaveLecturer(Lecturer lecturer)
        {
            using (var context = new LmPlatformModelsContext())
            {
                context.Set<Lecturer>().Add(lecturer);
                context.SaveChanges();
            }
        }
        public void DeleteLecturer(Lecturer lecturer)
        {
            using (var context = new LmPlatformModelsContext())
            {
                var deletedLecturer = context.Lecturers.FirstOrDefault(x => x.Id == lecturer.Id);
                if (deletedLecturer == null)
                    return;
                deletedLecturer.IsActive = false;
                context.Update(deletedLecturer);
                context.SaveChanges();
            }
        }
    }
}
