using LMPlatform.UI.Services.Modules;
using LMPlatform.UI.Services.Modules.Notes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace LMPlatform.UI.Services.Notes
{
    [ServiceContract]
    public interface INotesService
    {
        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json, UriTemplate = "/SaveNote")]
        ResultViewData SaveNote(int id, string text, int subjectId, int? lecturesScheduleId, int? labsScheduleId, int? practicalScheduleId);

        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json, UriTemplate = "/DeleteNote")]
        ResultViewData DeleteNote(int id);

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json, UriTemplate = "/GetUserNotes")]
        NoteViewResult GetUserNotes();

        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json, UriTemplate = "/SavePersonalNote")]
        ResultViewData SavePersonalNote(int id, string text, string date, string startTime, string endTime);

        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json, UriTemplate = "/DeletePersonalNote")]
        ResultViewData DeletePersonalNote(int id);

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json, UriTemplate = "/GetPersonalNotes")]
        UserNoteViewResult GetPersonalNotes();
    }
}
