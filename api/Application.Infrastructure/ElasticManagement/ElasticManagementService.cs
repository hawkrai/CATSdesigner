using Application.ElasticSearchEngine;
using Application.ElasticSearchEngine.SearchRepositories;
using Elasticsearch.Net;
using LMPlatform.ElasticDataModels;
using LMPlatform.Models;
using Nest;
using Nest.JsonNetSerializer;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Infrastructure.ElasticManagement
{
    public class ElasticManagementService : IElasticManagementService
    {
        public static string ElasticAddress => ConfigurationManager.AppSettings["ElasticAddress"];
        public static string ElasticUsername => ConfigurationManager.AppSettings["ElasticLogin"];
        public static string ElasticPassword => ConfigurationManager.AppSettings["ElasticPassword"];

        private readonly ElasticClient client;
        private readonly GroupElasticSearchRepository GroupRepo;
        private readonly StudentElasticSearchRepository StudentRepo;
        private readonly LecturerElasticSearchRepository LecturerRepo;
        private readonly ProjectElasticSearchRepository ProjectRepo;
        private readonly ElasticInitializer Initializer;
        public ElasticManagementService()
        {
            client = CreateClient();
            if (CheckConnection(client))
            {
                StudentRepo = new StudentElasticSearchRepository(client);
                LecturerRepo = new LecturerElasticSearchRepository(client);
                GroupRepo = new GroupElasticSearchRepository(client);
                ProjectRepo = new ProjectElasticSearchRepository(client);
                Initializer = new ElasticInitializer(client);
            }
        }


        private ElasticClient CreateClient() {
            var pool = new SingleNodeConnectionPool(new Uri(ElasticAddress));
            var connectionSettings =
                new ConnectionSettings(pool, sourceSerializer: (builtin, settings) => new JsonNetSerializer(
                    builtin, settings,
                    () => new JsonSerializerSettings
                    {
                        NullValueHandling = NullValueHandling.Include,
                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                    },
                    resolver => resolver.NamingStrategy = new CamelCaseNamingStrategy()
                ))
                .BasicAuthentication(ElasticUsername, ElasticPassword);

            return new ElasticClient(connectionSettings);
        }
        private bool CheckConnection(ElasticClient client)
        {
            var isConnected = client.Ping();
            return isConnected.IsValid;
        }
        public IEnumerable<ElasticGroup> GetGroupSearchResult(string searchStr) {
            return GroupRepo != null ? GroupRepo.Search(searchStr).ToList<ElasticGroup>() : null;
        }
        public IEnumerable<ElasticStudent> GetStudentSearchResult(string searchStr) {
            return StudentRepo != null ? StudentRepo.Search(searchStr).ToList<ElasticStudent>() : null;
        }
        public IEnumerable<ElasticLecturer> GetLecturerSearchResult(string searchStr) {
            return LecturerRepo != null ? LecturerRepo.Search(searchStr).ToList<ElasticLecturer>() : null;
        }
        public IEnumerable<ElasticProject> GetProjectSearchResult(string searchStr) {
            return ProjectRepo != null ? ProjectRepo.Search(searchStr).ToList<ElasticProject>() : null;
        }

        public void AddStudent(ElasticStudent student)
        {
            if(StudentRepo != null) StudentRepo.AddToIndex(student);
        }
        public void AddStudent(Student student)
        {
            if(StudentRepo != null)  StudentRepo.AddToIndex(Initializer.ConvertStudent(student));
        }
        public void AddProject(ElasticProject project)
        {
           if(ProjectRepo != null) ProjectRepo.AddToIndex(project);
        }
        public void AddProject(Project project)
        {
           if(ProjectRepo != null) ProjectRepo.AddToIndex(Initializer.ConvertProject(project));
        }
        public void AddLecturer(ElasticLecturer lecturer)
        {
           if(LecturerRepo != null) LecturerRepo.AddToIndex(lecturer);
        }
        public void AddLecturer(Lecturer lecturer)
        {
           if(LecturerRepo != null) LecturerRepo.AddToIndex(Initializer.ConvertLecturer(lecturer));
        }
        public void AddGroup(ElasticGroup group)
        {
           if(GroupRepo != null) GroupRepo.AddToIndex(group);
        }
        public void AddGroup(Group group)
        {
           if(GroupRepo != null) GroupRepo.AddToIndex(Initializer.ConvertGroup(group));
        }

        public void DeleteStudent(int modelId)
        {
            if(StudentRepo != null)  StudentRepo.DeleteFromIndex(modelId);
        }
        public void DeleteLecturer(int modelId)
        {
           if(LecturerRepo != null) LecturerRepo.DeleteFromIndex(modelId);
        }
        public void DeleteGroup(int modelId)
        {
           if(GroupRepo != null) GroupRepo.DeleteFromIndex(modelId);
        }
        public void DeleteProject(int modelId)
        {
           if(ProjectRepo != null) ProjectRepo.DeleteFromIndex(modelId);
        }

        public void ModifyStudent(ElasticStudent student)
        {
            DeleteStudent(student.Id);
            AddStudent(student);
        }
        public void ModifyStudent(Student student)
        {
            DeleteStudent(student.Id);
            AddStudent(student);
        }
        public void ModifyLecturer(ElasticLecturer lecturer)
        {
            DeleteLecturer(lecturer.Id);
            AddLecturer(lecturer);
        }
        public void ModifyLecturer(Lecturer lecturer)
        {
            DeleteLecturer(lecturer.Id);
            AddLecturer(lecturer);
        }
        public void ModifyGroup(ElasticGroup group)
        {
            DeleteGroup(group.Id);
            AddGroup(group);
        }
        public void ModifyGroup(Group group)
        {
            DeleteGroup(group.Id);
            AddGroup(group);
        }
        public void ModifyProject(ElasticProject project)
        {
            DeleteProject(project.Id);
            AddProject(project);
        }
        public void ModifyProject(Project project)
        {
            DeleteProject(project.Id);
            AddProject(project);
        }

        public void ClearElastic() {
            if (Initializer != null)
            {
                Initializer.DeleteGroups();
                Initializer.DeleteLecturers();
                Initializer.DeleteStudents();
                Initializer.DeleteProjects();
            }
        }
        public void InitElastic() {
            if (Initializer != null)
            {
                Initializer.InitializeGroups();
                Initializer.InitializeLecturers();
                Initializer.InitializeStudents();
                Initializer.InitializeProjects();
            }
        }

    }
}
