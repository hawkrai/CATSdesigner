﻿using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using Application.Core;
using Application.Core.Data;
using Application.Core.Helpers;
using Application.Infrastructure.CPManagement;
using Application.Infrastructure.CTO;
using LMPlatform.UI.Attributes;
using WebMatrix.WebData;

namespace LMPlatform.UI.ApiControllers.CP
{
    [JwtAuth]
    public class CpTaskSheetController : ApiController
    {
        public object Get(int courseProjectId)
        {
            return CpManagementService.GetTaskSheet(courseProjectId);
        }

        public List<TaskSheetData> Get([ModelBinder] GetPagedListParams parms)
        {
            return CpManagementService.GetTaskSheets(UserContext.CurrentUserId, parms);
        }

        public HttpResponseMessage Post([FromBody]TaskSheetData taskSheet)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            CpManagementService.SaveTaskSheet(UserContext.CurrentUserId, taskSheet);
            return new HttpResponseMessage(HttpStatusCode.OK);
        }

        private ICPManagementService CpManagementService
        {
            get { return _courseProjectManagementService.Value; }
        }

        private readonly LazyDependency<ICPManagementService> _courseProjectManagementService = new LazyDependency<ICPManagementService>();
    }
}