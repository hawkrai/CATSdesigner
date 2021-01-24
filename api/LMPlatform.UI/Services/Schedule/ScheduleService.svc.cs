using Application.Core;
using Application.Infrastructure.Models;
using Application.Infrastructure.ScheduleManagement;
using LMPlatform.UI.Attributes;
using LMPlatform.UI.Services.Modules;
using LMPlatform.UI.Services.Modules.Schedule;
using System;
using System.Globalization;
using System.Linq;

namespace LMPlatform.UI.Services.Schedule
{
    [JwtAuth]
    public class ScheduleService : IScheduleService
    {
        private readonly LazyDependency<IScheduleManagementService> scheduleManagementService = new LazyDependency<IScheduleManagementService>();

        public IScheduleManagementService ScheduleManagementService => scheduleManagementService.Value;

        public ScheduleViewResult GetSchedule(string dateStart, string dateEnd)
        {
            var dateTimeStart = DateTime.ParseExact(dateStart, "dd-MM-yyyy", CultureInfo.InvariantCulture);
            var dateTimeEnd = DateTime.ParseExact(dateEnd, "dd-MM-yyyy", CultureInfo.InvariantCulture);
            return new ScheduleViewResult
            {
                Schedule = ScheduleManagementService.GetScheduleBetweenDates(dateTimeStart, dateTimeEnd).Select(x => Convert(x))
            };
        }

        public ScheduleViewResult GetScheduleForDate(string date)
        {
            var dateTime = DateTime.ParseExact(date, "dd-MM-yyyy", CultureInfo.InvariantCulture);
            return new ScheduleViewResult
            {
                Schedule = ScheduleManagementService.GetScheduleForDate(dateTime).Select(x => Convert(x))
            };
        }

        public ResultViewData SaveDateLectures(int subjectId, string date, string startTime, string endTime, string building, string audience)
        {

            try
            {
                var dateTime = DateTime.ParseExact(date, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                var start = DateTime.ParseExact(startTime, "HH:mm", CultureInfo.InvariantCulture).TimeOfDay;
                var end = DateTime.ParseExact(endTime, "HH:mm", CultureInfo.InvariantCulture).TimeOfDay;

                var canAdd = ScheduleManagementService.CheckIfAllowed(dateTime, start, end, building, audience);
                if (!canAdd)
                {
                    return new ResultViewData
                    {
                        Message = "Время либо место занято",
                        Code = "500"
                    };
                }
                ScheduleManagementService.SaveDateLectures(
                    subjectId,
                    dateTime,
                    start,
                    end,
                    building,
                    audience
                    );
                return new ResultViewData
                {
                    Message = "Дата успешно добавлена",
                    Code = "200"
                };
            }
            catch
            {
                return new ResultViewData
                {
                    Message = "Произошла ошибка при добавлении даты",
                    Code = "500"
                };
            }
        }

        public ResultViewData SaveDateLab(int subjectId, int subGroupId, string date, string startTime, string endTime, string building, string audience)
		{
            var dateTime = DateTime.ParseExact(date, "dd/MM/yyyy", CultureInfo.InvariantCulture);
            var start = DateTime.ParseExact(startTime, "HH:mm", CultureInfo.InvariantCulture).TimeOfDay;
            var end = DateTime.ParseExact(endTime, "HH:mm", CultureInfo.InvariantCulture).TimeOfDay;
            try
			{
                var canAdd = ScheduleManagementService.CheckIfAllowed(dateTime, start, end, building, audience);
                if (!canAdd)
                {
                    return new ResultViewData
                    {
                        Message = "Время либо место занято",
                        Code = "500"
                    };
                }
                ScheduleManagementService.SaveScheduleProtectionLabsDate(
					subjectId,
					subGroupId,
	                dateTime,
                    start,
                    end,
					building,
					audience
					);
				return new ResultViewData
				{
					Message = "Дата успешно добавлена",
					Code = "200"
				};
			}
            catch
            {
				return new ResultViewData
				{
					Message = "Произошла ошибка при добавлении даты",
					Code = "500"
				};
			}
		}

        private ScheduleViewData Convert(ScheduleModel schedule)
        {
            return new ScheduleViewData
            {
                Audience = schedule.Audience,
                Building = schedule.Building,
                Color = schedule.Color,
                End = schedule.End,
                Id = schedule.Id,
                Name = schedule.Name,
                ShortName = schedule.ShortName,
                Start = schedule.Start,
                SubjectId = schedule.SubjectId,
                Teachers = schedule.Teachers.Select(x => new LectorViewData(x.Lecturer, true)),
                Type = schedule.Type,

            };
        }
	}
}
