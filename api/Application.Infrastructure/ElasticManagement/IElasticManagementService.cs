using LMPlatform.ElasticDataModels;
using LMPlatform.Models;
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

        public void AddStudent(ElasticStudent student);
        public void AddLecturer(ElasticLecturer lecturer);
        public void AddGroup(ElasticGroup group);
        public void AddProject(ElasticProject project);

        public void AddStudent(Student student);
        public void AddLecturer(Lecturer lecturer);
        public void AddGroup(Group group);
        public void AddProject(Project project);

        public void DeleteStudent(int modelId);
        public void DeleteLecturer(int modelId);
        public void DeleteGroup(int modelId);
        public void DeleteProject(int modelId);

        public void ModifyStudent(ElasticStudent student);
        public void ModifyLecturer(ElasticLecturer lecturer);
        public void ModifyGroup(ElasticGroup group);
        public void ModifyProject(ElasticProject project);

        public void ModifyStudent(Student student);
        public void ModifyLecturer(Lecturer lecturer);
        public void ModifyGroup(Group group);
        public void ModifyProject(Project project);

        void ClearElastic();
        void InitElastic();
    }
}
