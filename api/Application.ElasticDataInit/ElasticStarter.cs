
﻿using Application.ElasticDataModels;
using Application.ElasticSearchEngine.SerachMethods;
using System;
using System.Collections.Generic;

namespace Aplication.ElasticDataInit
{
    static class ElasticStarter
    {
        //change to current dB connection
         private static string CONNECTION_STRING_NAME = "name=ElasticContext";
        /*private static string CONNECTION_STRING_NAME = "DefaultConnection";*/
        //change to current elastic server params
        private static string ELASTIC_ADDRESS = "http://localhost:9200/";
        private static string ELASTIC_USERNAME = "elastic";
        private static string ELASTIC_PASSWORD = "199611";
        private static void PrintStudents(IEnumerable<Student> list)
        {
            Console.WriteLine("Students".PadLeft(50, '=').PadRight(50, '='));
            foreach (Student st in list)
            {
                Console.WriteLine(st.Id);
                Console.WriteLine(st.FullName);
                Console.WriteLine(st.User.UserName);
                Console.WriteLine(st.User.Phone);
               

            }
        }

        private static void PrintLecturers(IEnumerable<Lecturer> list)
        {
            Console.WriteLine("Lecturers".PadLeft(50, '=').PadRight(50, '='));
            foreach (Lecturer st in list)
            {
                Console.WriteLine(st.Id);
                Console.WriteLine(st.FullName);
            }
        }

        private static void PrintGroups(IEnumerable<Group> list)
        {
            Console.WriteLine("Groups".PadLeft(50, '=').PadRight(50, '='));
            foreach (Group st in list)
            {
                Console.WriteLine(st.Id);
                Console.WriteLine(st.Name);
            }
        }

        private static void PrintProjects(IEnumerable<Project> list)
        {
            Console.WriteLine("Projects".PadLeft(50, '=').PadRight(50, '='));
            foreach (Project st in list)
            {
                Console.WriteLine(st.Id);
                Console.WriteLine(st.Title);
            }
        }

        private static void StartSearch(string host, string userName, string password)
        {
            GroupElasticSearchMethod groupSearch = new GroupElasticSearchMethod(host, userName, password);
            StudentElasticSearchMethod studentSearch = new StudentElasticSearchMethod(host, userName, password);
            ProjectElasticSearchMethod projectSearch = new ProjectElasticSearchMethod(host, userName, password);
            LecturerElasticSearchMethod lecturerSearch = new LecturerElasticSearchMethod(host, userName, password);

            PrintGroups(groupSearch.SearchAll());
            PrintLecturers(lecturerSearch.SearchAll());
            PrintProjects(projectSearch.SearchAll());
            PrintStudents(studentSearch.SearchAll());

            string str = "";

            while (!str.Equals("exit"))
            {
                Console.WriteLine("put str ('exit' to exit");
                str = Console.ReadLine();
                PrintGroups(groupSearch.Search(str));
                PrintLecturers(lecturerSearch.Search(str));
                PrintProjects(projectSearch.Search(str));
                PrintStudents(studentSearch.Search(str));

            }
        }



        public static void Main(string[] args)
        {
            string host = ELASTIC_ADDRESS;
            string userName = ELASTIC_USERNAME;
            string password = ELASTIC_PASSWORD;
            ElasticInitializer initializer = new ElasticInitializer(CONNECTION_STRING_NAME, host, userName, password);

            initializer.DeleteGroups();
            Console.WriteLine("groups deleted");
            initializer.DeleteStudents();
            Console.WriteLine("students deleted");
            initializer.DeleteProjects();
            Console.WriteLine("projects deleted");
            initializer.DeleteLecturers();
            Console.WriteLine("lecturers deleted");

            Console.WriteLine("lecturers {0} initialized", initializer.InitializeLecturers());
            Console.WriteLine("students {0} initialized", initializer.InitializeStudents());
            Console.WriteLine("groups {0} initialized", initializer.InitializeGroups());
            Console.WriteLine("projects {0} initialized", initializer.InitializeProjects());
            Console.WriteLine("Finished, press any key");

            Console.ReadKey();

            //search in console
            StartSearch(host, userName, password);
            Console.ReadKey();

        }
    }
}
