using Application.ElasticSearchEngine.SerachMethods;
using Application.ElasticDataModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace LMPlatform.UI.Controllers
{
    public class ElasticSearchController : Controller
    {
        // GET: ElasticSearch
        private static string ELASTIC_ADDRESS = "http://localhost:9200/";
        private static string ELASTIC_USERNAME = "elastic";
        private static string ELASTIC_PASSWORD = "199611";

        [HttpGet]
        public ActionResult GetLecturerSearchResult(string searchStr)
        {           
            try
            {
                LecturerElasticSearchMethod searcher = new LecturerElasticSearchMethod(ELASTIC_ADDRESS, ELASTIC_USERNAME, ELASTIC_PASSWORD);
                List<Lecturer> results = searcher.Search(searchStr).ToList<Lecturer>();

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
                StudentElasticSearchMethod searcher = new StudentElasticSearchMethod(ELASTIC_ADDRESS, ELASTIC_USERNAME, ELASTIC_PASSWORD);
                List<Student> results = searcher.Search(searchStr).ToList<Student>();
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
                GroupElasticSearchMethod searcher = new GroupElasticSearchMethod(ELASTIC_ADDRESS, ELASTIC_USERNAME, ELASTIC_PASSWORD);
                List<Group> results = searcher.Search(searchStr).ToList<Group>();
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
    }
}