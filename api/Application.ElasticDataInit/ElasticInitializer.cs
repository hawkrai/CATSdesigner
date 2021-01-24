using Nest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Data.Entity;
using Elasticsearch.Net;
using Nest.JsonNetSerializer;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Application.ElasticDataModels;

namespace Aplication.ElasticDataInit
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

        private List<Project> GetProjects()
        {
            using (ElasticContext context = new ElasticContext(connectionString))
            {
                return context.Projects
                    .ToList<Project>();
            }
        }
        private List<Group> GetGroups()
        {
            using (ElasticContext context = new ElasticContext(connectionString))
            {
                return context.Groups
                    .ToList<Group>();
            }
        }
        private List<Lecturer> GetLecturers() {
            using (ElasticContext context = new ElasticContext(connectionString))
            {
                return context.Lecturers
                    .Include(l => l.User)
                    .ToList<Lecturer>();
            }
        }
        private List<Student> GetStudents()
        {
                using (ElasticContext context = new ElasticContext(connectionString))
                {
                    return context.Students    
                        
                        .Include(s => s.User)
                        .Include(g => g.Group)
                        .ToList<Student>(); 
                }


        }


        private static CreateIndexDescriptor GetProjectMap(string indexName)
        {
            CreateIndexDescriptor map = new CreateIndexDescriptor(indexName);
            map.Mappings(M => M
                .Map<Project>(m => m
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
                .Map<Group>(m => m
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
                .Map<Lecturer>(m => m
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
                        
                        .Object<User>(u=>u
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
                .Map<Student>(m => m
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
                        .Object<User>(o => o
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
            List<Student> students = GetStudents();

            client.IndexMany(students,studentsIndexName);

            return students.Count;
        }
        public int InitializeLecturers()
        {
            string lecturersIndexName = LECUTRERS_INDEX_NAME;
            client.Indices.Create(GetLecturerMap(lecturersIndexName));
            List<Lecturer> lecturers = GetLecturers();

            client.IndexMany(lecturers, lecturersIndexName);
            return lecturers.Count;
        }
        public int InitializeGroups()
        {
            string groupsIndexName = GROUPS_INDEX_NAME;
            client.Indices.Create(GetGroupMap(groupsIndexName));
            List<Group> groups = GetGroups();

            client.IndexMany(groups,groupsIndexName);

            return groups.Count;
        }
        public int InitializeProjects()
        {
            string projectssIndexName = PROJECTS_INDEX_NAME;
            client.Indices.Create(GetProjectMap(projectssIndexName));
            List<Project> projects = GetProjects();

            client.IndexMany<Project>(projects, projectssIndexName);

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

