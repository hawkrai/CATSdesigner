using LMP.Models;
using System.Collections.Generic;

namespace Application.Infrastructure.SubjectManagement
{
    public interface IModulesManagementService
    {
        ICollection<Module> GetModules();
        IEnumerable<Module> GetModules(int subjectId);
    }
}