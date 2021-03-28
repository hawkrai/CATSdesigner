
using Application.ElasticDataModels;
using Application.ElasticSearchEngine.SearchRepositories;
using System;
using System.Collections.Generic;
using System.Configuration;

namespace Application.ElasticSearchEngine
{
    public class ElasticStarter
    {
    /*    //change to current dB connection
         private static string CONNECTION_STRING_NAME = "name=ElasticContext";*/
        private static string CONNECTION_STRING_NAME = "DefaultConnection";*/

        private string address = "";
        private string username = "";
        private string password = "";

        public ElasticStarter(string address, string username, string password )
        {
            this.address = address;
            this.username = username;
            this.password = password;
        }

        public bool InitializeElastic()
        {
            
            try
            {
                ElasticInitializer initializer = new ElasticInitializer(CONNECTION_STRING_NAME, address, username, password);


                initializer.InitializeLecturers();
                initializer.InitializeStudents();
                initializer.InitializeGroups();
                initializer.InitializeProjects();

                return true;
            }
            catch(Exception) {
                return false; 
            }
        }
        public bool ClearElastic()
        {       
            try
            {
                ElasticInitializer initializer = new ElasticInitializer(CONNECTION_STRING_NAME, address, username, password);

                initializer.DeleteGroups();
                initializer.DeleteStudents();
                initializer.DeleteProjects();
                initializer.DeleteLecturers();

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }   

    }
}
