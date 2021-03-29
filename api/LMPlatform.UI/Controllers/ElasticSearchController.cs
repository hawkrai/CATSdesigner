
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

namespace LMPlatform.UI.Controllers
{
    public class ElasticSearchController : BasicController
    {
        // GET: ElasticSearch
        public string ElasticAddress => ConfigurationManager.AppSettings["ElasticAddress"];
        public string ElasticUsername => ConfigurationManager.AppSettings["ElasticLogin"];
        public string ElasricPassword => ConfigurationManager.AppSettings["ElasticPAssword"];

        [HttpGet]
        public ActionResult GetLecturerSearchResult(string searchStr)
        {           
            try
            {
                LecturerElasticSearchRepository searcher = new LecturerElasticSearchRepository(ElasticAddress, ElasticUsername, ElasricPassword);
                List<ElasticLecturer> results = searcher.Search(searchStr).ToList<ElasticLecturer>();

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
                StudentElasticSearchRepository searcher = new StudentElasticSearchRepository(ElasticAddress, ElasticUsername, ElasricPassword);
                List<ElasticStudent> results = searcher.Search(searchStr).ToList<ElasticStudent>();
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
                GroupElasticSearchRepository searcher = new GroupElasticSearchRepository(ElasticAddress, ElasticUsername, ElasricPassword);
                List<ElasticGroup> results = searcher.Search(searchStr).ToList<ElasticGroup>();
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
                ElasticStarter init = new ElasticStarter(ElasticAddress,ElasticUsername,ElasricPassword);
                init.InitializeElastic();

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
                ElasticStarter init = new ElasticStarter(ElasticAddress, ElasticUsername, ElasricPassword);
                init.ClearElastic();
                return StatusCode(HttpStatusCode.OK);
            }
            catch (Exception e)
            {
                return StatusCode(HttpStatusCode.InternalServerError, e.Message);
            }
        }
    }
}