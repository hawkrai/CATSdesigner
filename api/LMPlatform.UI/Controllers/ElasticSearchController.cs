
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Application.ElasticSearchEngine.SearchRepositories;
using Application.ElasticSearchEngine;
using System.Net;
using System.Configuration;
using Application.Core.UI.Controllers;
using LMPlatform.ElasticDataModels;
using Application.Infrastructure.ElasticManagement;
using Application.Core;

namespace LMPlatform.UI.Controllers
{
    public class ElasticSearchController : BasicController
    {
        // GET: ElasticSearch
        public static string ElasticAddress => ConfigurationManager.AppSettings["ElasticAddress"];
        public static string ElasticUsername => ConfigurationManager.AppSettings["ElasticLogin"];
        public static string ElasticPassword => ConfigurationManager.AppSettings["ElasticPassword"];

        private readonly IElasticManagementService elasticManagement = 
            new ElasticManagementService(ElasticAddress, ElasticUsername, ElasticPassword);

        [HttpGet]
        public ActionResult GetLecturerSearchResult(string searchStr)
        {           
            try
            {
                var results = elasticManagement.GetLecturerSearchResult(searchStr);
                return this.Json(results, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return new JsonResult
                {
                    Data = new
                    {
                        Message = "Произошла ошибка поиска",
                        Error = e.Message
                    }
                };
            }

        }

        [HttpGet]
        public ActionResult GetStudentSearchResult(string searchStr)
        {
            try
            {
                var results = elasticManagement.GetStudentSearchResult(searchStr);
                return this.Json(results,JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return new JsonResult
                {
                    Data = new
                    {
                        Message = "Произошла ошибка поиска",
                        Error = e.Message
                    }
                };
            }

        }

        [HttpGet]
        public ActionResult GetGroupSearchResult(string searchStr)
        {       
            try
            {
                var results = elasticManagement.GetGroupSearchResult(searchStr);
                return this.Json(results, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return new JsonResult
                {
                    Data = new
                    {
                        Message = "Произошла ошибка поиска",
                        Error = e.Message
                    }
                };
            }
        }

        [HttpPost]
        public ActionResult ElasticInit()
        {
            try
            {
                elasticManagement.InitElastic();
                return StatusCode(HttpStatusCode.OK);
            }
            catch (Exception e)
            {
                return StatusCode(HttpStatusCode.InternalServerError, e.Message);
            }
        }

        [HttpPost]
        public ActionResult ElasticClear()
        {          
            try
            {
                elasticManagement.ClearElastic();
                return StatusCode(HttpStatusCode.OK);
            }
            catch (Exception e)
            {
                return StatusCode(HttpStatusCode.InternalServerError, e.Message);
            }
        }
    }
}