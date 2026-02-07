using Application.Core;
using Application.Core.Helpers;
using Application.Infrastructure.CPManagement;
using Application.Infrastructure.CTO;
using Application.Infrastructure.LecturerManagement;
using LMPlatform.Models;
using LMPlatform.Models.CP;
using LMPlatform.UI.Attributes;
using Nest;
using Org.BouncyCastle.Asn1.Ocsp;
using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Mvc;

namespace LMPlatform.UI.ApiControllers.CP
{
    [JwtAuth]
    public class CourseProjectConsultationDateController : ApiController
    {
        private readonly LazyDependency<ICpPercentageGraphService> _percentageService =
            new LazyDependency<ICpPercentageGraphService>();

        private readonly LazyDependency<ILecturerManagementService> _lecturerService =
            new LazyDependency<ILecturerManagementService>();

        private readonly LazyDependency<ICPManagementService> _courseProjectManagementService =
            new LazyDependency<ICPManagementService>();

        private ICpPercentageGraphService PercentageService => _percentageService.Value;

        private ILecturerManagementService LecturerService => _lecturerService.Value;

        private ICPManagementService CpManagementService => _courseProjectManagementService.Value;

        /// <summary>
        /// CREATE or UPDATE consultation date
        /// </summary>
        public HttpResponseMessage Post([FromBody] CourseProjectConsultationDateData consultationDate)
        {
            if (consultationDate == null)
            {
                return Request.CreateResponse(
                    HttpStatusCode.BadRequest,
                    "Model is null"
                );
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
                consultationDate.Id,
                consultationDate.Notes
            );

            if (saved != null)
            {
                var result = new CourseProjectConsultationDateData
                {
                    Id = saved.Id,
                    Day = saved.Day.ToString("dd.MM.yyyy"),
                    StartTime = saved.StartTime?.ToString(@"hh\:mm"),
                    EndTime = saved.EndTime?.ToString(@"hh\:mm"),
                    Audience = saved.Audience,
                    Building = saved.Building,
                    GroupId = saved.GroupId ?? 0,
                    Subject = CpManagementService.GetSubject(saved.SubjectId),
                    Teacher = new LecturerData(
                        LecturerService.GetLecturer(saved.LecturerId)
                     ),
                    Notes = saved.Notes,
                };

                return Request.CreateResponse(
                    HttpStatusCode.OK,
                    new
                    {          
                        Code = 200,
                        Message = !consultationDate.Id.HasValue || consultationDate.Id.Value == 0 ?
                            "text.date.add.response.success" : "text.date.edit.response.success",
                        Schedule = result
                    }
                );
            }
            else
            {
                var lecturer = LecturerService.GetLecturer(teacherId);

                return Request.CreateResponse(
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
