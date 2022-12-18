using Application.Core;
using Application.Infrastructure.CPManagement;
using Application.Infrastructure.CTO;
using LMPlatform.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Web.Http;
using Application.Core.Helpers;
using LMPlatform.UI.Attributes;

namespace LMPlatform.UI.ApiControllers.CP
{
    [JwtAuth]
    public class CourseProjectNewsController : ApiController
    {
        private readonly LazyDependency<ICPManagementService> _cpManagementService = new LazyDependency<ICPManagementService>();

        private ICPManagementService CpManagementService
            => _cpManagementService.Value;

        [HttpGet]
        public List<NewsData> Get(int id)
        {
            return CpManagementService.GetNewses(UserContext.CurrentUserId, id);
        }

        [HttpDelete]
        public System.Web.Mvc.JsonResult Delete([FromBody]CourseProjectNews deleteData)
        {
            try
            {
                
                CpManagementService.DeleteNews(deleteData);

                return new System.Web.Mvc.JsonResult()
                {
                    Data = new
                    {
                        Message = "Объявление успешно удалено",
                        Error = false
                    }
                };
            }
            catch (Exception)
            {
                return new System.Web.Mvc.JsonResult()
                {
                    Data = new
                    {
                        Message = "Произошла ошибка при удалении новости",
                        Error = true
                    }
                };
            }
        }
    }
}
