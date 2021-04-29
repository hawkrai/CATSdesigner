using LMPlatform.ElasticDataModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Infrastructure.ElasticManagement
{
    public interface IElasticManagementService
    {
        IEnumerable<ElasticGroup> GetGroupSearchResult(string searchStr);
        IEnumerable<ElasticStudent> GetStudentSearchResult(string searchStr);
        IEnumerable<ElasticLecturer> GetLecturerSearchResult(string searchStr);
        IEnumerable<ElasticProject> GetProjectSearchResult(string searchStr);
        void ClearElastic();
        void InitElastic();
    }
}
