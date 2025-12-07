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
        private readonly LazyDependency<ICpPercentageGraphService> _percentageService =
            new LazyDependency<ICpPercentageGraphService>();

        private readonly LazyDependency<ILecturerManagementService> _lecturerService =
            new LazyDependency<ILecturerManagementService>();

        private ICpPercentageGraphService PercentageService => _percentageService.Value;

        private ILecturerManagementService LecturerService => _lecturerService.Value;

        /// <summary>
        /// CREATE or UPDATE consultation date
        /// </summary>
        public HttpStatusCodeResult Post([FromBody] CourseProjectConsultationDateData consultationDate)
        {
            if (consultationDate == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, "Model is null");
            }

            int currentUserId = UserContext.CurrentUserId;

            int teacherId = consultationDate.Teacher?.LectorId ?? 0;

            if (teacherId == 0)
            {
                var lecturer = LecturerService.GetLecturer(currentUserId);
                teacherId = lecturer?.Id ?? 0;
            }

            CourseProjectConsultationDate saved = PercentageService.SaveConsultationDate(
                currentUserId,                    
                teacherId,                        
                consultationDate.Day,
                consultationDate.Subject.Id,
                consultationDate.StartTime,
                consultationDate.EndTime,
                consultationDate.Audience,
                consultationDate.Building,
                consultationDate.GroupId,
                consultationDate.Id               
            );

            if (saved == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.OK, "Дата успешно добавлена");
            }
            else
            {
                var lecturer = LecturerService.GetLecturer(teacherId);
                return new HttpStatusCodeResult(
                    HttpStatusCode.InternalServerError,
                    lecturer != null
                        ? (lecturer.LastName + " " + lecturer.FirstName)
                        : "Error"
                );
            }
        }

        /// <summary>
        /// DELETE consultation date
        /// </summary>
        public void Post(int id)
        {
            PercentageService.DeleteConsultationDate(UserContext.CurrentUserId, id);
        }
    }
}
