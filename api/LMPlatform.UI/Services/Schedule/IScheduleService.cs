using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;

namespace LMPlatform.UI.Services.Schedule
{
    using LMPlatform.UI.Attributes;
    using LMPlatform.UI.Services.Modules.Notes;
    using LMPlatform.UI.Services.Modules.Schedule;
    using Modules;
    [ServiceContract]
    public interface IScheduleService
    {
        [OperationContract]
        [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, UriTemplate = "/SaveDateLab")]
        ResultViewData SaveDateLab(int subjectId, int subGroupId, string date, string startTime, string endTime, string building, string audience);

        [OperationContract]
        [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json, UriTemplate = "/SaveDateLectures")]
        ResultViewData SaveDateLectures(int subjectId, string date, string startTime, string endTime, string building, string audience);

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json, UriTemplate = "/GetSchedule?dateStart={dateStart}&dateEnd={dateEnd}")]
        ScheduleViewResult GetSchedule(string dateStart, string dateEnd);

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json, UriTemplate = "/GetScheduleForDate?date={date}")]
        ScheduleViewResult GetScheduleForDate(string date);

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json, UriTemplate = "/GetUserSchedule?dateStart={dateStart}&dateEnd={dateEnd}")]
        ScheduleViewResult GetUserSchedule(string dateStart, string dateEnd);

        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json, UriTemplate = "/SaveNote")]
        ResultViewData SaveNote(int id, int subjectId, string text, string date, string time);

        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json, UriTemplate = "/DeleteNote")]
        ResultViewData DeleteNote(int id);

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json, UriTemplate = "/GetUserNotes")]
        NoteViewResult GetUserNotes();

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json, UriTemplate = "/GetScheduleBetweenTime?date={date}&startTime={startTime}&endTime={endTime}")]
        ScheduleViewResult GetScheduleBetweenTime(string date, string startTime, string endTime);

    }
}
