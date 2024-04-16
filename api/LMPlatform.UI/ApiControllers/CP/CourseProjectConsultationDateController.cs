using System.Net;
using System.Web.Http;
using System.Web.Mvc;
using Application.Core;
using Application.Core.Helpers;
using Application.Infrastructure.CPManagement;
using Application.Infrastructure.CTO;
using Application.Infrastructure.LecturerManagement;
using LMPlatform.Models;
using LMPlatform.Models.CP;
using LMPlatform.UI.Attributes;

namespace LMPlatform.UI.ApiControllers.CP
{
    [JwtAuth]
    public class CourseProjectConsultationDateController : ApiController
    {
        private readonly LazyDependency<ICpPercentageGraphService> _percentageService = new LazyDependency<ICpPercentageGraphService>();

        private readonly LazyDependency<ILecturerManagementService> _lecturerService = new LazyDependency<ILecturerManagementService>();

        private ICpPercentageGraphService PercentageService
            => _percentageService.Value;

        private ILecturerManagementService lecturerService
            => _lecturerService.Value;

        public HttpStatusCodeResult Post([FromBody]CourseProjectConsultationDateData consultationDate)
        {
            CourseProjectConsultationDate courseProjectConsultationDate = PercentageService.SaveConsultationDate(consultationDate.LecturerId, consultationDate.Day, consultationDate.SubjectId, consultationDate.StartTime,
                consultationDate.EndTime, consultationDate.Audience, consultationDate.Building, consultationDate.GroupId, consultationDate.Id);

            if(courseProjectConsultationDate == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.OK, "Дата успешно добавлена");
            } else
            {
                Lecturer lecturer = lecturerService.GetLecturer(courseProjectConsultationDate.LecturerId);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, "Время и место занято " + lecturer.LastName + " " + lecturer.FirstName);
            }
            
        }

        public void Post(int id)
        {
            PercentageService.DeleteConsultationDate(UserContext.CurrentUserId, id);
        }
    }
}