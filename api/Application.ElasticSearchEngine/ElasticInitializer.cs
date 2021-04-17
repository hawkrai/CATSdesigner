using Nest;
using System;
using System.Collections.Generic;
using Elasticsearch.Net;
using Nest.JsonNetSerializer;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Data.Entity;
using System.Linq;
using LMPlatform.Data.Infrastructure;
using LMPlatform.ElasticDataModels;
using System.Configuration;

namespace Application.ElasticSearchEngine
{
    public class ElasticInitializer
    {
        private string connectionString;
        private string elasticUri;
        private ElasticClient client;
        /*private static string LECTURERS_INDEX_NAME => ConfigurationManager.AppSettings["LecturersIndexName"];
        private static string PROJECTS_INDEX_NAME => ConfigurationManager.AppSettings["ProjectsIndexName"];
        private static string GROUPS_INDEX_NAME => ConfigurationManager.AppSettings["GroupsIndexName"];
        private static string STUDENTS_INDEX_NAME => ConfigurationManager.AppSettings["StudentsIndexName"];*/
        private static string LECTURERS_INDEX_NAME = "lecturers";
        private static string PROJECTS_INDEX_NAME = "projects";
        private static string GROUPS_INDEX_NAME = "groups";
        private static string STUDENTS_INDEX_NAME = "students";

        public ElasticInitializer(ElasticClient elasticClient)
        {
            client = elasticClient;
            CheckConnection(client);
        }
        public ElasticInitializer(string connectionString, string elsticUri, string userName, string password)
        {
            this.elasticUri = elasticUri;
            this.connectionString = connectionString;
            var pool = new SingleNodeConnectionPool(new Uri(elsticUri));
            var connectionSettings =
                new ConnectionSettings(pool, sourceSerializer: (builtin, settings) => new JsonNetSerializer(
                    builtin, settings,
                    () => new JsonSerializerSettings { NullValueHandling = NullValueHandling.Include,
                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore},
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
        private List<ElasticProject> GetProjects(int skip, int take)
        {
            using (LmPlatformModelsContext context = new LmPlatformModelsContext())
            {
                return context.ElasticProjects.Skip(skip).Take(take)
                    .ToList();
            }
        }
        private List<ElasticGroup> GetGroups(int skip, int take)
        {
            using (LmPlatformModelsContext context = new LmPlatformModelsContext())
            {
                return context.ElasticGroups.Skip(skip).Take(take)
                    .ToList();
            }
        }
        private List<ElasticLecturer> GetLecturers(int skip, int take)
        {
            using (LmPlatformModelsContext context = new LmPlatformModelsContext())
            {
                return context.ElasticLecturers.Skip(skip).Take(take)
                    .Include(l => l.User)
                    .ToList<ElasticLecturer>();
            }
        }
        private List<ElasticStudent> GetStudents(int skip, int take)
        {
                using (LmPlatformModelsContext context = new LmPlatformModelsContext())
                {
                    return context.ElasticStudents.Skip(skip).Take(take)
                        .Include(s => s.User)
                        .Include(g => g.Group)
                        .ToList(); 
                }
        }
        private static CreateIndexDescriptor GetProjectMap(string indexName)
        {
            CreateIndexDescriptor map = new CreateIndexDescriptor(indexName);
            map.Mappings(M => M
                .Map<ElasticProject>(m => m
                    .Dynamic(false)
                    .Properties(prop => prop
                        .Number(s => s
                            .Name(n => n.Id)
                            .Type(NumberType.Integer)
                        )
                        .Date(s=>s
                            .Name(n=>n.DateOfChange)
                            )
                        .Text(s => s
                            .Name(n => n.Title)
                            )
                    )
                )
             )
           ;
            return map;
        }
        private static CreateIndexDescriptor GetGroupMap(string indexName)
        {
            CreateIndexDescriptor map = new CreateIndexDescriptor(indexName);
            map.Mappings(M => M
                .Map<ElasticGroup>(m => m
                    .Dynamic(false)
                    .Properties(prop => prop
                        .Number(s => s
                            .Name(n => n.Id)
                            .Type(NumberType.Integer)
                        )
                        .Number(num => num
                            .Name(n => n.SecretaryId)
                            )
                        .Text(s => s
                            .Name(n => n.Name)
                            )
                    )
                )
             )
           ;
            return map;
        }
        private static CreateIndexDescriptor GetLecturerMap(string indexName)
        {
            CreateIndexDescriptor map = new CreateIndexDescriptor(indexName);
            map.Mappings(M => M
                .Map<ElasticLecturer>(m => m
                    .Dynamic(false)
                    .Properties(prop => prop
                        .Number(s => s
                            .Name(n => n.Id)
                            .Type(NumberType.Integer)
                        )
                        .Text(s => s
                            .Name(n => n.FullName)
                        )
                        .Text(o => o
                            .Name(s => s.Skill)
                         )             
                        .Object<ElasticUser>(u=>u
                            .Dynamic(false)
                            .Name(n=>n.User)
                            .Properties(pr => pr
                                .Text(t=>t
                                    .Name(n=>n.SkypeContact)
                                    )
                                .Text(t => t
                                    .Name(n => n.Phone)
                                    )
                                .Text(t => t
                                    .Name(n => n.About)
                                )
                            )
                        )
                    )
                )
             )    
           ;
            return map;
        }
        private static CreateIndexDescriptor GetStudentMap(string indexName)
        {
            CreateIndexDescriptor map = new CreateIndexDescriptor(indexName);
            map.Mappings(M => M
                .Map<ElasticStudent>(m => m
                .Dynamic(false)
                    .Properties(prop => prop
                        .Number(s => s
                            .Name(n => n.Id)
                            .Type(NumberType.Integer)
                        )
                        .Text(s => s
                            .Name(n => n.FullName)
                        )
                        .Text(s => s
                            .Name(n => n.Email)
                        )
                        .Number(s => s
                            .Name(n => n.GroupId)
                        )
                        .Object<ElasticUser>(o => o
                            .Dynamic(false)
                            .Name(s => s.User)
                             .Properties(pr => pr
                                .Text(t => t
                                    .Name(n => n.SkypeContact)
                                    )
                                .Text(t => t
                                    .Name(n => n.Phone)
                                    )
                                .Text(t => t
                                    .Name(n => n.About)
                                )
                            )
                         )
                    )
                 )
              )
           ;
            return map;
        }
        public void InitializeStudents()
        {
            int portion = 100;
            string studentsIndexName = STUDENTS_INDEX_NAME;
            client.Indices.Create(GetStudentMap(studentsIndexName));

            IEnumerable<ElasticStudent> toIndex = GetStudents(0, portion);

            for (int i = portion; toIndex.Count() > 0; i += portion)
            {
                client.IndexMany(toIndex, studentsIndexName);
                toIndex = GetStudents(i, portion);
            }
        }
        public void InitializeLecturers()
        {
            int portion = 100;
            string lecturersIndexName = LECTURERS_INDEX_NAME;
            client.Indices.Create(GetLecturerMap(lecturersIndexName));
            IEnumerable<ElasticLecturer> toIndex = GetLecturers(0, portion);

            for (int i = portion; toIndex.Count() > 0; i+=portion) {
                client.IndexMany(toIndex, lecturersIndexName);
                toIndex = GetLecturers(i, portion);
            }
    
        }
        public void InitializeGroups()
        {
            int portion = 100;
            string groupsIndexName = GROUPS_INDEX_NAME;
            client.Indices.Create(GetGroupMap(groupsIndexName));

            IEnumerable<ElasticGroup> toIndex = GetGroups(0, portion);

            for (int i = portion; toIndex.Count() > 0; i += portion)
            {
                client.IndexMany(toIndex, groupsIndexName);
                toIndex = GetGroups(i, portion);
            }
        }
        public void InitializeProjects()
        {
            int portion = 100;
            string projectsIndexName = PROJECTS_INDEX_NAME;
            client.Indices.Create(GetProjectMap(projectsIndexName));

            IEnumerable<ElasticProject> toIndex = GetProjects(0, portion);

            for (int i = portion; toIndex.Count() > 0; i += portion)
            {
                client.IndexMany(toIndex, projectsIndexName);
                toIndex = GetProjects(i, portion);
            }
        }
        public void DeleteStudents()
        {
            client.Indices.Delete(STUDENTS_INDEX_NAME);
        }
        public void DeleteLecturers()
        {
            client.Indices.Delete(LECTURERS_INDEX_NAME);
        }
        public void DeleteGroups()
        {
            client.Indices.Delete(GROUPS_INDEX_NAME);
        }
        public void DeleteProjects()
        {
            client.Indices.Delete(PROJECTS_INDEX_NAME);
        }
    }  
}

