using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;
using Application.Core;
using Application.Core.Data;
using Application.Core.Helpers;
using Application.Core.SLExcel;
using Application.Infrastructure.DPManagement;

namespace LMPlatform.UI.ApiControllers.DP
{
    public class DpStatisticController : ApiController
    {
        public HttpResponseMessage GetPercentageDp([System.Web.Http.ModelBinding.ModelBinder] GetPagedListParams parms)
        {
            var data = new SLExcelData();

            var headerData = PercentageService.GetDpPercentageDate(UserContext.CurrentUserId, parms);
            var rowsData = DpManagementService.GetDpMarks(UserContext.CurrentUserId, parms);

            data.Headers.Add("Студент");
            data.Headers.AddRange(headerData);
            data.Headers.Add("Оценка");
            data.DataRows.AddRange(rowsData);

            var file = new SLExcelWriter().GenerateExcel(data);

            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
            response.Content = new StreamContent(new MemoryStream(file));
            response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
            response.Content.Headers.ContentDisposition.FileName = "PercentageDP.xlsx";
            response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

            return response;
        }

        private IDpPercentageGraphService PercentageService
        {
            get { return _percentageService.Value; }
        }

        private IDpManagementService DpManagementService
        {
            get { return _diplomProjectManagementService.Value; }
        }

        private readonly LazyDependency<IDpManagementService> _diplomProjectManagementService = new LazyDependency<IDpManagementService>();

        private readonly LazyDependency<IDpPercentageGraphService> _percentageService = new LazyDependency<IDpPercentageGraphService>();
    }
}