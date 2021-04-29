using Application.ElasticSearchEngine;
using Application.ElasticSearchEngine.SearchRepositories;
using Elasticsearch.Net;
using LMPlatform.ElasticDataModels;
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
        public ElasticManagementService()
        {
            ElasticClient client = CreateClient();
            if (CheckConnection(client))
            {
                StudentRepo = new StudentElasticSearchRepository(client);
                LecturerRepo = new LecturerElasticSearchRepository(client);
                GroupRepo = new GroupElasticSearchRepository(client);
                ProjectRepo = new ProjectElasticSearchRepository(client);
            }
            else
            {
                throw new Exception("Client was not connected to ElasticSearch server\n");
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
            return GroupRepo.Search(searchStr).ToList<ElasticGroup>();
        }
        public IEnumerable<ElasticStudent> GetStudentSearchResult(string searchStr) {
            return StudentRepo.Search(searchStr).ToList<ElasticStudent>();
        }
        public IEnumerable<ElasticLecturer> GetLecturerSearchResult(string searchStr) {
            return LecturerRepo.Search(searchStr).ToList<ElasticLecturer>();
        }
        public IEnumerable<ElasticProject> GetProjectSearchResult(string searchStr) {
            return ProjectRepo.Search(searchStr).ToList<ElasticProject>();
        }

        public void AddStudent(ElasticStudent student)
        {
            StudentRepo.AddToIndex(student);
        }
        public void AddLecturer(ElasticLecturer lecturer)
        {
            LecturerRepo.AddToIndex(lecturer);
        }
        public void AddGroup(ElasticGroup group)
        {
            GroupRepo.AddToIndex(group);
        }
        public void AddProject(ElasticProject project)
        {
            ProjectRepo.AddToIndex(project);
        }

        public void DelecteStudent(int modelId)
        {
            StudentRepo.DeleteFromIndex(modelId);
        }
        public void DelecteLecturer(int modelId)
        {
            LecturerRepo.DeleteFromIndex(modelId);
        }
        public void DelecteGroup(int modelId)
        {
            GroupRepo.DeleteFromIndex(modelId);
        }
        public void DelecteProject(int modelId)
        {
            ProjectRepo.DeleteFromIndex(modelId);
        }

        public void ClearElastic() {
            ElasticInitializer init = new ElasticInitializer(client);
            init.DeleteGroups();
            init.DeleteLecturers();
            init.DeleteStudents();
            init.DeleteProjects();
        }
        public void InitElastic() {
            ElasticInitializer init = new ElasticInitializer(client);
            init.InitializeGroups();
            init.InitializeLecturers();
            init.InitializeStudents();
            init.InitializeProjects();
        }

    }
}
