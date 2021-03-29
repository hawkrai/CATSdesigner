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

namespace Application.ElasticSearchEngine
{
    class ElasticInitializer
    {
        private string connectionString;
        private string elasticUri;
        private ElasticClient client;
        public const string LECUTRERS_INDEX_NAME = "lecturers" ;
        public const string PROJECTS_INDEX_NAME = "projects";
        public const string GROUPS_INDEX_NAME = "groups";
        public const string STUDENTS_INDEX_NAME = "students";
       
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

        private List<ElasticProject> GetProjects()
        {
            using (LmPlatformModelsContext context = new LmPlatformModelsContext())
            {
                return context.ElasticProjects
                    .ToList();
            }
        }
        private List<ElasticGroup> GetGroups()
        {
            using (LmPlatformModelsContext context = new LmPlatformModelsContext())
            {
                return context.ElasticGroups
                    .ToList();
            }
        }
        private List<ElasticLecturer> GetLecturers() {
            using (LmPlatformModelsContext context = new LmPlatformModelsContext())
            {
                return context.ElasticLecturers
                    .Include(l => l.User)
                    .ToList<ElasticLecturer>();
            }
        }
        private List<ElasticStudent> GetStudents()
        {
                using (LmPlatformModelsContext context = new LmPlatformModelsContext())
                {
                    return context.ElasticStudents
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

        public int InitializeStudents()
        {
            string studentsIndexName = STUDENTS_INDEX_NAME;
            client.Indices.Create(GetStudentMap(studentsIndexName));
            List<ElasticStudent> students = GetStudents();

            client.IndexMany(students,studentsIndexName);

            return students.Count;
        }
        public int InitializeLecturers()
        {
            string lecturersIndexName = LECUTRERS_INDEX_NAME;
            client.Indices.Create(GetLecturerMap(lecturersIndexName));
            List<ElasticLecturer> lecturers = GetLecturers();

            client.IndexMany(lecturers, lecturersIndexName);
            return lecturers.Count;
        }
        public int InitializeGroups()
        {
            string groupsIndexName = GROUPS_INDEX_NAME;
            client.Indices.Create(GetGroupMap(groupsIndexName));
            List<ElasticGroup> groups = GetGroups();

            client.IndexMany(groups,groupsIndexName);

            return groups.Count;
        }
        public int InitializeProjects()
        {
            string projectssIndexName = PROJECTS_INDEX_NAME;
            client.Indices.Create(GetProjectMap(projectssIndexName));
            List<ElasticProject> projects = GetProjects();

            client.IndexMany<ElasticProject>(projects, projectssIndexName);

            return projects.Count;
        }

        public void DeleteStudents()
        {
            client.Indices.Delete(STUDENTS_INDEX_NAME);
        }
        public void DeleteLecturers()
        {
            client.Indices.Delete(LECUTRERS_INDEX_NAME);
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

