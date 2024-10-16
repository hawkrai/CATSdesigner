﻿using System.Net;
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

        private ILecturerManagementService LecturerService
            => _lecturerService.Value;

        public HttpStatusCodeResult Post([FromBody] CourseProjectConsultationDateData consultationDate)
        {
            int userId = UserContext.CurrentUserId;
            Lecturer lecturer = LecturerService.GetLecturer(userId);
            int lecturerId = lecturer == null ? 0 : lecturer.Id;
            CourseProjectConsultationDate courseProjectConsultationDate = PercentageService.SaveConsultationDate(lecturerId, consultationDate.Day, consultationDate.Subject.Id, consultationDate.StartTime,
                consultationDate.EndTime, consultationDate.Audience, consultationDate.Building, consultationDate.GroupId, consultationDate.Id);

            if(courseProjectConsultationDate == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.OK, "Дата успешно добавлена");
            } else
            {
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, lecturer.LastName + " " + lecturer.FirstName);
            }

        }

        public void Post(int id)
        {
            PercentageService.DeleteConsultationDate(UserContext.CurrentUserId, id);
        }
    }
}