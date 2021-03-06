﻿using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using Application.Core;
using Application.Core.Data;
using Application.Core.Helpers;
using Application.Infrastructure.DPManagement;
using Application.Infrastructure.DTO;
using LMPlatform.UI.Attributes;
using WebMatrix.WebData;

namespace LMPlatform.UI.ApiControllers.DP
{
    [JwtAuth]
    public class DpTaskSheetController : ApiController
    {
        public object Get(int diplomProjectId)
        {
            return DpManagementService.GetTaskSheet(diplomProjectId);
        }

        public List<TaskSheetData> Get([ModelBinder] GetPagedListParams parms)
        {
            return DpManagementService.GetTaskSheets(UserContext.CurrentUserId, parms);
        }

        public HttpResponseMessage Post([FromBody]TaskSheetData taskSheet)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            DpManagementService.SaveTaskSheet(UserContext.CurrentUserId, taskSheet);
            return new HttpResponseMessage(HttpStatusCode.OK);
        }

        private IDpManagementService DpManagementService
        {
            get { return _diplomProjectManagementService.Value; }
        }

        private readonly LazyDependency<IDpManagementService> _diplomProjectManagementService = new LazyDependency<IDpManagementService>();
    }
}