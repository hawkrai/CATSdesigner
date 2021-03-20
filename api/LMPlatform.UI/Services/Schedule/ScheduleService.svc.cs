using Application.Core;
using Application.Core.Helpers;
using Application.Infrastructure.Models;
using Application.Infrastructure.NoteManagement;
using Application.Infrastructure.PracticalManagement;
using Application.Infrastructure.ScheduleManagement;
using Application.Infrastructure.SubjectManagement;
using LMPlatform.Models;
using LMPlatform.UI.Attributes;
using LMPlatform.UI.Services.Modules;
using LMPlatform.UI.Services.Modules.Notes;
using LMPlatform.UI.Services.Modules.Schedule;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using WebMatrix.WebData;

namespace LMPlatform.UI.Services.Schedule
{
    [JwtAuth]
    public class ScheduleService : IScheduleService
    {
        private readonly LazyDependency<IScheduleManagementService> scheduleManagementService = new LazyDependency<IScheduleManagementService>();
        private readonly LazyDependency<ISubjectManagementService> subjectManagementService = new LazyDependency<ISubjectManagementService>();
        private readonly LazyDependency<IPracticalManagementService> practicalManagementService = new LazyDependency<IPracticalManagementService>();
        public IScheduleManagementService ScheduleManagementService => scheduleManagementService.Value;
        public ISubjectManagementService SubjectManagementService => subjectManagementService.Value;


        public IPracticalManagementService PracticalManagementService => practicalManagementService.Value;


        public ScheduleViewResult GetSchedule(string dateStart, string dateEnd)
        {
            var dateTimeStart = DateTime.ParseExact(dateStart, "dd-MM-yyyy", CultureInfo.InvariantCulture);
            var dateTimeEnd = DateTime.ParseExact(dateEnd, "dd-MM-yyyy", CultureInfo.InvariantCulture);
            return new ScheduleViewResult
            {
                Schedule = ScheduleManagementService.GetScheduleBetweenDates(dateTimeStart, dateTimeEnd).Select(x => new ScheduleViewData(x))
            };
        }

        public ScheduleViewResult GetScheduleForDate(string date)
        {
            try
            {
                var dateTime = DateTime.ParseExact(date, "dd-MM-yyyy", CultureInfo.InvariantCulture);
                return new ScheduleViewResult
                {
                    Schedule = ScheduleManagementService.GetScheduleForDate(dateTime).Select(x => new ScheduleViewData(x))
                };
            } catch(Exception ex)
            {
                return new ScheduleViewResult();
            }
        }

        public ResultViewData SaveDateLectures(int subjectId, string date, string startTime, string endTime, string building, string audience, Note note)
        {

            try
            {
                var isUserAssigned = SubjectManagementService.IsUserAssignedToSubject(UserContext.CurrentUserId, subjectId);
                if (!isUserAssigned)
                {
                    return new ResultViewData
                    {
                        Message = "Пользователь не добавлен к предмету",
                        Code = "500"
                    };
                }
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
                var lecturesSchedule = new LecturesScheduleVisiting
                {
                    Audience = audience,
                    Date = dateTime,
                    Building = building,
                    EndTime = end,
                    StartTime = start,
                    SubjectId = subjectId,
                };
                if (note != null)
                {
                    note.UserId = UserContext.CurrentUserId;
                    lecturesSchedule.Notes.Add(note);
                }
                ScheduleManagementService.SaveDateLectures(lecturesSchedule);
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

        public ResultViewData SaveDateLab(int subjectId, int subGroupId, string date, string startTime, string endTime, string building, string audience, Note note)
		{
            try
			{
                var isUserAssigned = SubjectManagementService.IsUserAssignedToSubject(UserContext.CurrentUserId, subjectId);
                if (!isUserAssigned)
                {
                    return new ResultViewData
                    {
                        Message = "Пользователь не добавлен к предмету",
                        Code = "500"
                    };
                }
                var dateTime = DateTime.ParseExact(date, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                var start = DateTime.ParseExact(startTime, "HH:mm", CultureInfo.InvariantCulture).TimeOfDay;
                var end = DateTime.ParseExact(endTime, "HH:mm", CultureInfo.InvariantCulture).TimeOfDay;
                var canAdd = ScheduleManagementService.CheckIfAllowed(dateTime, start, end, building, audience);
                if (!canAdd)
                {
                    return new ResultViewData
                    {
                        Message = "Время и место занято",
                        Code = "500"
                    };
                }
                var labsSchedule = new ScheduleProtectionLabs
                {
                    Audience = audience,
                    Date = dateTime,
                    Building = building,
                    EndTime = end,
                    StartTime = start,
                    SubjectId = subjectId,
                    SuGroupId = subGroupId
                };
                if (note != null)
                {
                    note.UserId = UserContext.CurrentUserId;
                    labsSchedule.Notes.Add(note);
                }
                ScheduleManagementService.SaveScheduleProtectionLabsDate(labsSchedule);
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

        public ResultViewData SaveDatePractical(int subjectId, int groupId, string date, string startTime, string endTime, string building, string audience, Note note)
        {
            try {
                var isUserAssigned = SubjectManagementService.IsUserAssignedToSubject(UserContext.CurrentUserId, subjectId);
                if (!isUserAssigned)
                {
                    return new ResultViewData
                    {
                        Message = "Пользователь не добавлен к предмету",
                        Code = "500"
                    };
                }
                var dateTime = DateTime.ParseExact(date, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                var start = DateTime.ParseExact(startTime, "HH:mm", CultureInfo.InvariantCulture).TimeOfDay;
                var end = DateTime.ParseExact(endTime, "HH:mm", CultureInfo.InvariantCulture).TimeOfDay;
                var canAdd = ScheduleManagementService.CheckIfAllowed(dateTime, start, end, building, audience);
                if (!canAdd)
                {
                    return new ResultViewData
                    {
                        Message = "Время и место занято",
                        Code = "500"
                    };
                }
                var practicalSchedule = new ScheduleProtectionPractical
                {
                    Audience = audience,
                    Date = dateTime,
                    Building = building,
                    EndTime = end,
                    StartTime = start,
                    SubjectId = subjectId,
                    GroupId = groupId
                };
                if (note != null)
                {
                    note.UserId = UserContext.CurrentUserId;
                    practicalSchedule.Notes.Add(note);
                }
                ScheduleManagementService.SaveDatePractical(practicalSchedule);

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

        public ScheduleViewResult GetUserSchedule(string dateStart, string dateEnd)
        {
            var dateTimeStart = DateTime.ParseExact(dateStart, "dd-MM-yyyy", CultureInfo.InvariantCulture);
            var dateTimeEnd = DateTime.ParseExact(dateEnd, "dd-MM-yyyy", CultureInfo.InvariantCulture);
            return new ScheduleViewResult
            {
                Schedule = ScheduleManagementService.GetUserSchedule(UserContext.CurrentUserId, dateTimeStart, dateTimeEnd).Select(x => new ScheduleViewData(x))
            };
        }

        public ScheduleViewResult GetScheduleBetweenTime(string date, string startTime, string endTime)
        {
            var dateTime = DateTime.ParseExact(date, "dd-MM-yyyy", CultureInfo.InvariantCulture);
            var start = DateTime.ParseExact(startTime, "HH:mm", CultureInfo.InvariantCulture).TimeOfDay;
            var end = DateTime.ParseExact(endTime, "HH:mm", CultureInfo.InvariantCulture).TimeOfDay;
            return new ScheduleViewResult
            {
                Schedule = ScheduleManagementService.GetScheduleBetweenTimes(dateTime, start, end).Select(x => new ScheduleViewData(x))
            };
        }

        public ResultViewData DeleteLabScheduleDate(int id)
        {
            try
            {
                SubjectManagementService.DeleteLabsVisitingDate(id);

                return new ResultViewData
                {
                    Message = "Дата успешно удалена",
                    Code = "200"
                };
            }
            catch (Exception)
            {
                return new ResultViewData
                {
                    Message = "Произошла ошибка при удалении даты",
                    Code = "500"
                };
            }
        }

        public ResultViewData DeleteLectureScheduleDate(int id)
        {
            try
            {
                SubjectManagementService.DeleteLectionVisitingDate(id);

                return new ResultViewData
                {
                    Message = "Дата успешно удалена",
                    Code = "200"
                };
            }
            catch
            {
                return new ResultViewData
                {
                    Message = "Произошла ошибка при удалении даты",
                    Code = "500"
                };
            }
        }

        public ResultViewData DeletePracticalScheduleDate(int id)
        {
            try
            {
                PracticalManagementService.DeletePracticalScheduleDate(id);

                return new ResultViewData
                {
                    Message = "Дата успешно удалена",
                    Code = "200"
                };
            }
            catch (Exception)
            {
                return new ResultViewData
                {
                    Message = "Произошла ошибка при удалении даты",
                    Code = "500"
                };
            }
        }
    }
}
