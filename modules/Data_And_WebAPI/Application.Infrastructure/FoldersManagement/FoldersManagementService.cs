using Application.Core.Data;
using LMP.Data.Repositories;
using LMP.Models;
using System.Collections.Generic;
using System.Linq;

namespace Application.Infrastructure.FoldersManagement
{
    public class FoldersManagementService : IFoldersManagementService
    {
        public List<Folders> GetAllFolders()
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                var currentUser = repositoriesContainer.FoldersRepository.GetAll(new Query<Folders>(u => u.Pid == 0)).ToList();
                return currentUser;
            }
        }

        public Folders FolderRootBySubjectModuleId(int submodid)
        {
             using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
             {
                var currentUser = repositoriesContainer.FoldersRepository.FolderRootBySubjectModuleId(submodid);
                return currentUser;
             }
        }
    }
}