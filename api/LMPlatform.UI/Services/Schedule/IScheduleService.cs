using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace LMPlatform.UI.Services.Schedule
{
    using LMPlatform.UI.Services.Modules.Schedule;
    using Modules;
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IScheduleService" in both code and config file together.
    [ServiceContract]
    public interface IScheduleService
    {
        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/SaveDateLab")]
        ResultViewData SaveDateLab(int subjectId, int subGroupId, string date, string startTime, string endTime, string building, string audience);

        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/SaveDateLectures")]
        ResultViewData SaveDateLectures(int subjectId, string date, string startTime, string endTime, string building, string audience);

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/GetSchedule?dateStart={dateStart}&dateEnd={dateEnd}")]
        ScheduleViewResult GetSchedule(string dateStart, string dateEnd);

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/GetScheduleForDate?date={date}")]
        ScheduleViewResult GetScheduleForDate(string date);

    }
}
