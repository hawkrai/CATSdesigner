using Application.Core;
using Application.Core.Helpers;
using Application.Core.SLExcel;
using Application.Infrastructure.GroupManagement;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;

namespace LMPlatform.UI.ApiControllers.CP
{
    public class CpStatisticController : ApiController
    {
        private readonly LazyDependency<IGroupManagementService> _groupManagementService = new LazyDependency<IGroupManagementService>();

        public IGroupManagementService GroupManagementService 
            => _groupManagementService.Value;

        // GET api/<controller>
        public HttpResponseMessage Get(int subjectId, int groupId)
        {
            var data = new SLExcelData();

            var headerData = this.GroupManagementService.GetCpScheduleVisitings(subjectId, groupId, UserContext.CurrentUserId);
            var rowsData = this.GroupManagementService.GetCpScheduleMarks(subjectId, groupId, UserContext.CurrentUserId);

            data.Headers.Add("Студент");
            data.Headers.AddRange(headerData);
            data.DataRows.AddRange(rowsData);

            var file = new SLExcelWriter().GenerateExcel(data);

            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
            response.Content = new StreamContent(new MemoryStream(file));
            response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
            response.Content.Headers.ContentDisposition.FileName = "CPVisiting.xlsx";
            response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

            return response;
        }

        public HttpResponseMessage GetPercentageCP(int subjectId, string group)
        {
            var groupId = int.Parse(group);
            var data = new SLExcelData();

            var headerData = this.GroupManagementService.GetCpPercentage(subjectId, groupId, UserContext.CurrentUserId);
            var rowsData = this.GroupManagementService.GetCpMarks(subjectId, groupId, UserContext.CurrentUserId);

            data.Headers.Add("Студент");
            data.Headers.AddRange(headerData);
            data.Headers.Add("Оценка");
            data.DataRows.AddRange(rowsData);

            var file = new SLExcelWriter().GenerateExcel(data);

            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
            response.Content = new StreamContent(new MemoryStream(file));
            response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
            response.Content.Headers.ContentDisposition.FileName = "PercentageCP.xlsx";
            response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

            return response;
        }
    }
}