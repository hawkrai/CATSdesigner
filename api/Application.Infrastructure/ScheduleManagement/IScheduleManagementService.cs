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
        void SaveScheduleProtectionLabsDate(ScheduleProtectionLabs scheduleProtectionLabs);

        void SaveDateLectures(LecturesScheduleVisiting lecturesScheduleVisiting);
        public void SaveDatePractical(ScheduleProtectionPractical scheduleProtectionPractical);

        bool CheckIfAllowed(DateTime date, TimeSpan startTime, TimeSpan endTime, string building, string audience);

        IEnumerable<ScheduleModel> GetScheduleForDate(DateTime date);

        IEnumerable<ScheduleModel> GetScheduleBetweenDates(DateTime startDate, DateTime endDate);

        IEnumerable<ScheduleModel> GetScheduleBetweenTimes(DateTime date, TimeSpan startTime, TimeSpan endTime);

        IEnumerable<ScheduleModel> GetUserSchedule(int userId, DateTime startDate, DateTime endDate);
    }
}
