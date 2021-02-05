using Application.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Infrastructure.ScheduleManagement
{
    public interface IScheduleManagementService
    {
        void SaveScheduleProtectionLabsDate(int subjectId, int subGroupId, DateTime date, TimeSpan startTime, TimeSpan endTime, string building, string audience);

        void SaveDateLectures(int subjectId, DateTime date, TimeSpan startTime, TimeSpan endTime, string building, string audience);

        bool CheckIfAllowed(DateTime date, TimeSpan startTime, TimeSpan endTime, string building, string audience);

        IEnumerable<ScheduleModel> GetScheduleForDate(DateTime date);

        IEnumerable<ScheduleModel> GetScheduleBetweenDates(DateTime startDate, DateTime endDate);

        IEnumerable<ScheduleModel> GetScheduleBetweenTimes(DateTime date, TimeSpan startTime, TimeSpan endTime);

        IEnumerable<ScheduleModel> GetUserSchedule(int userId, DateTime startDate, DateTime endDate);
    }
}
