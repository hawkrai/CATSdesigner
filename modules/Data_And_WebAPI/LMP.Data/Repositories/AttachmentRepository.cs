using Application.Core.Data;
using LMP.Data.Infrastructure;
using LMP.Data.Repositories.RepositoryContracts;
using LMP.Models;

namespace LMP.Data.Repositories
{
    public class AttachmentRepository : RepositoryBase<LmPlatformModelsContext, Attachment>, IAttachmentRepository
    {
        public AttachmentRepository(LmPlatformModelsContext dataContext) : base(dataContext)
        {
        }
    }
}
