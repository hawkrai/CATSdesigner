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
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Infrastructure.ElasticManagement
{
    public class ElasticManagementService : IElasticManagementService
    {
        private readonly ElasticClient client;
        public ElasticManagementService(string elsticUri, string userName, string password)
        {
            var pool = new SingleNodeConnectionPool(new Uri(elsticUri));
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
                .BasicAuthentication(userName, password);

            client = new ElasticClient(connectionSettings);
            CheckConnection(client);
        }
        private void CheckConnection(ElasticClient client)
        {
            var isConnected = client.Ping();
            if (!isConnected.IsValid)
            {
                throw new Exception("Client was not connected to ElasticSearch server\n" + isConnected.OriginalException.Message);
            }
        }
        public IEnumerable<ElasticGroup> GetGroupSearchResult(string searchStr) {
            GroupElasticSearchRepository searcher = new GroupElasticSearchRepository(client);
            return searcher.Search(searchStr).ToList<ElasticGroup>();
        }
        public IEnumerable<ElasticStudent> GetStudentSearchResult(string searchStr) {
            StudentElasticSearchRepository searcher = new StudentElasticSearchRepository(client);
            return searcher.Search(searchStr).ToList<ElasticStudent>();
        }
        public IEnumerable<ElasticLecturer> GetLecturerSearchResult(string searchStr) {
            LecturerElasticSearchRepository searcher = new LecturerElasticSearchRepository(client);
            return searcher.Search(searchStr).ToList<ElasticLecturer>();
        }
        public IEnumerable<ElasticProject> GetProjectSearchResult(string searchStr) {
            ProjectElasticSearchRepository searcher = new ProjectElasticSearchRepository(client);
            return searcher.Search(searchStr).ToList<ElasticProject>();
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
