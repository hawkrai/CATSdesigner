using LMP.Models;
using System.Collections.Generic;

namespace Application.Infrastructure.FoldersManagement
{
    public interface IFoldersManagementService
    {
        List<Folders> GetAllFolders();

        Folders FolderRootBySubjectModuleId(int SubjectModulesId);
    }
}
