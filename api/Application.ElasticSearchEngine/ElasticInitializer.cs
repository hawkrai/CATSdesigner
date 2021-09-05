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
using LMPlatform.Models;
using LMPlatform.Data.Repositories;
using Application.ElasticSearchEngine.SearchRepositories;

namespace Application.ElasticSearchEngine
{
    public class ElasticInitializer
    {
        private string connectionString;
        private string elasticUri;
        private ElasticClient client;
        private static string LECTURERS_INDEX_NAME => ConfigurationManager.AppSettings["LecturersIndexName"];
        private static string PROJECTS_INDEX_NAME => ConfigurationManager.AppSettings["ProjectsIndexName"];
        private static string GROUPS_INDEX_NAME => ConfigurationManager.AppSettings["GroupsIndexName"];
        private static string STUDENTS_INDEX_NAME => ConfigurationManager.AppSettings["StudentsIndexName"];

        public ElasticInitializer(ElasticClient elasticClient)
        {
            client = elasticClient;
            CheckConnection(client);
        }
        public ElasticInitializer(string connectionString, string elasticUri, string userName, string password)
        {
            this.elasticUri = elasticUri;
            this.connectionString = connectionString;
            var pool = new SingleNodeConnectionPool(new Uri(elasticUri));
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

        public ElasticUser ConvertUser(User user)
        {
            ElasticUser elUser = new ElasticUser();

            elUser.Id = user.Id;
            elUser.UserName = user.UserName;
            elUser.SkypeContact = user.SkypeContact;
            elUser.Phone = user.Phone;
            elUser.Email = user.Email;
            elUser.About = user.About;

            return elUser;
        }
        public ElasticGroup ConvertGroup(Group group) {
            ElasticGroup elGroup = new ElasticGroup();
            elGroup.Id = group.Id;
            elGroup.GraduationYear = group.GraduationYear;
            elGroup.Name = group.Name;
            elGroup.SecretaryId = group.SecretaryId;
            elGroup.StartYear = group.StartYear;
            return elGroup;
        }
        public ElasticLecturer ConvertLecturer(Lecturer  lecturer)
        {
            ElasticLecturer elLecturer = new ElasticLecturer();

            elLecturer.Id = lecturer.Id;
            elLecturer.FirstName = lecturer.FirstName;
            elLecturer.LastName = lecturer.LastName;
            elLecturer.MiddleName = lecturer.MiddleName;
            elLecturer.Skill = lecturer.Skill;
            elLecturer.User = ConvertUser(lecturer.User);
         
            return elLecturer;
        }
        public ElasticStudent ConvertStudent(Student student)
        {
            ElasticStudent elStudent = new ElasticStudent();

            elStudent.Id = student.Id;
            elStudent.FirstName = student.FirstName;
            elStudent.LastName = student.LastName;
            elStudent.MiddleName = student.MiddleName;
            elStudent.GroupId = student.GroupId;
            elStudent.Group = ConvertGroup(student.Group);
            elStudent.User = ConvertUser(student.User);

            return elStudent;
        }
        public ElasticProject ConvertProject(Project project)
        {
            ElasticProject elProject = new ElasticProject();

            elProject.Id = project.Id;
            elProject.Title = project.Title;
            elProject.CreatorId = project.CreatorId;
            elProject.Attachments = project.Attachments;

            return elProject;
        }

        private List<Project> GetProjects(int skip, int take)
        {
            using (var context = new LmPlatformModelsContext())
            {
                return context.Projects
                    .OrderBy(u => u.Id)
                    .Skip(skip)
                    .Take(take).ToList();
            }
        }
        private List<Group> GetGroups(int skip, int take)
        {
            using (var context = new LmPlatformModelsContext())
            {
                return context.Groups
                    .OrderBy(u => u.Id)
                    .Skip(skip)
                    .Take(take).ToList();
            }
        }
        private List<Student> GetStudents(int skip, int take)
        {
            using (var context = new LmPlatformModelsContext())
            {
                return context.Students
                    .Include(s => s.User)
                    .Include(s => s.Group)
                    .OrderBy(s => s.Id)
                    .Skip(skip)
                    .Take(take).ToList();
            }
        }
        private List<Lecturer> GetLecturers(int skip, int take)
        {
            using (var context = new LmPlatformModelsContext())
            {
                return context.Lecturers
                    .Include(s => s.User)
                    .OrderBy(u => u.Id)
                    .Skip(skip)
                    .Take(take).ToList();
            }
        }

        private List<ElasticProject> GetElasticProjects(int skip, int take)
        {
            List<Project> oldProjects = GetProjects(skip, take);
            List<ElasticProject> elProjects = new List<ElasticProject>();

            foreach (Project gr in oldProjects)
            {
                elProjects.Add(ConvertProject(gr));
            }

            return elProjects;
        }
        private List<ElasticGroup> GetElasticGroups(int skip, int take)
        {
            List<Group> oldGroups = GetGroups(skip, take);
            List<ElasticGroup> elGroups = new List<ElasticGroup>();

            foreach (Group gr in oldGroups)
            {
                elGroups.Add(ConvertGroup(gr));
            }

            return elGroups;

        }
        private List<ElasticLecturer> GetElasticLecturers(int skip, int take)
        {
            List<Lecturer> oldLecturers = GetLecturers(skip, take);
            List<ElasticLecturer> elLecturers = new List<ElasticLecturer>();

            foreach (Lecturer gr in oldLecturers)
            {
                elLecturers.Add(ConvertLecturer(gr));
            }

            return elLecturers;
        }
        private List<ElasticStudent> GetElasticStudents(int skip, int take)
        {
            List<Student> oldStudents = GetStudents(skip, take);
            List<ElasticStudent> elStudents = new List<ElasticStudent>();

            foreach (Student gr in oldStudents)
            {
                elStudents.Add(ConvertStudent(gr));
            }

            return elStudents;
        }

        public void InitializeStudents()
        {
            int portion = 100;
            string studentsIndexName = STUDENTS_INDEX_NAME;
            client.Indices.Create(StudentElasticSearchRepository.GetStudentMap(studentsIndexName));

           List<ElasticStudent> toIndex = GetElasticStudents(0, portion);

            for (int i = portion; toIndex.Count() > 0; i += portion)
            {
                client.IndexMany(toIndex, studentsIndexName);
                toIndex = GetElasticStudents(i, portion);
            }
        }
        public void InitializeLecturers()
        {
            int portion = 100;
            string lecturersIndexName = LECTURERS_INDEX_NAME;
            client.Indices.Create(LecturerElasticSearchRepository.GetLecturerMap(lecturersIndexName));
            List<ElasticLecturer> toIndex = GetElasticLecturers(0, portion);

            for (int i = portion; toIndex.Count() > 0; i += portion)
            {
                client.IndexMany(toIndex, lecturersIndexName);
                toIndex = GetElasticLecturers(i, portion);
            }

        }
        public void InitializeGroups()
        {
            int portion = 100;
            string groupsIndexName = GROUPS_INDEX_NAME;
            client.Indices.Create(GroupElasticSearchRepository.GetaGroupMap(groupsIndexName));

            List<ElasticGroup> toIndex = GetElasticGroups(0, portion);

            for (int i = portion; toIndex.Count() > 0; i += portion)
            {
                client.IndexMany(toIndex, groupsIndexName);
                toIndex = GetElasticGroups(i, portion);
            }
        }
        public void InitializeProjects()
        {
            int portion = 100;
            string projectsIndexName = PROJECTS_INDEX_NAME;
            client.Indices.Create(ProjectElasticSearchRepository.GetProjectMap(projectsIndexName));

            List<ElasticProject> toIndex = GetElasticProjects(0, portion);

            for (int i = portion; toIndex.Count() > 0; i += portion)
            {
                client.IndexMany(toIndex, projectsIndexName);
                toIndex = GetElasticProjects(i, portion);
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



