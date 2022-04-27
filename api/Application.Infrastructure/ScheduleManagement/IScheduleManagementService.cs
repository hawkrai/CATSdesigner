using Application.Infrastructure.Models;
using LMPlatform.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Infrastructure.ScheduleManagement
{
    public interface IScheduleManagementService
    {
        ScheduleProtectionLabs SaveScheduleProtectionLabsDate(ScheduleProtectionLabs scheduleProtectionLabs);

        LecturesScheduleVisiting SaveDateLectures(LecturesScheduleVisiting lecturesScheduleVisiting);
        ScheduleProtectionPractical SaveDatePractical(ScheduleProtectionPractical scheduleProtectionPractical);

        IEnumerable<ScheduleModel> CheckIfAllowed(DateTime date, TimeSpan startTime, TimeSpan endTime, string building, string audience);

        IEnumerable<ScheduleModel> GetScheduleForDate(DateTime date);

        IEnumerable<ScheduleModel> GetScheduleBetweenDates(DateTime startDate, DateTime endDate);

        IEnumerable<ScheduleModel> GetScheduleBetweenTimes(DateTime date, TimeSpan startTime, TimeSpan endTime);

        IEnumerable<ScheduleModel> GetUserSchedule(int userId, DateTime startDate, DateTime endDate);


        ScheduleModel GetScheduleById(int scheduleId, ClassType classType);
    }
}
