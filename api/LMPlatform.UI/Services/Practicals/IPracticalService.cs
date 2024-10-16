﻿using System.Collections.Generic;
using System.ServiceModel;
using System.ServiceModel.Web;
using LMPlatform.UI.Services.Modules;
using LMPlatform.UI.Services.Modules.CoreModels;
using LMPlatform.UI.Services.Modules.Labs;
using LMPlatform.UI.Services.Modules.Practicals;
using LMPlatform.UI.Services.Modules.Schedule;

namespace LMPlatform.UI.Services.Practicals
{
    [ServiceContract]
    public interface IPracticalService
    {
        // OK
        [OperationContract]
        [WebInvoke(UriTemplate = "/GetPracticals/{subjectId}", RequestFormat = WebMessageFormat.Json, Method = "GET")]
        PracticalsResult GetPracticals(string subjectId);

        // OK
        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/Save")]
        ResultViewData Save(int subjectId, int id, string theme, int duration, int order, string shortName,
            string pathFile, string attachments);

        // OK
        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/Delete")]
        ResultViewData Delete(int id, int subjectId);

        [OperationContract]
        [WebInvoke(UriTemplate = "/GetPracticalsV2?subjectId={subjectId}&groupId={groupId}",
            RequestFormat = WebMessageFormat.Json, Method = "GET")]
        PracticalsResult GetPracticalsV2(int subjectId, int groupId);

        // OK
        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/GetMarks")]
        StudentsMarksResult GetMarks(int subjectId, int groupId);

        // OK
        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json,
            UriTemplate = "/SavePracticalsVisitingData")]
        ResultViewData SavePracticalsVisitingData(int dateId, List<string> marks, List<string> comments,
            List<int> studentsId, List<int> Id, List<StudentsViewData> students, List<bool> showForStudents,
            int subjectId);

        // OK
        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/SaveStudentPracticalsMark")]
        ResultViewData SaveStudentPracticalsMark(int studentId, int practicalId, string mark, string comment,
            string date, int id, int subjectId);


        [OperationContract]
        [WebInvoke(UriTemplate = "/UpdatePracticalsOrder", RequestFormat = WebMessageFormat.Json, Method = "POST")]
        ResultViewData UpdatePracticalsOrder(int subjectId, int prevIndex, int curIndex);

        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/SaveStudentPracticalMark")]
        ResultViewData SaveStudentPracticalMark(int studentId, int practicalId, string mark, string comment,
            string date, int id, bool showForStudent, int subjectId);

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json,
            UriTemplate = "/GetUserPracticalFiles?userId={userId}&subjectId={subjectId}")]
        UserLabFilesResult GetUserPracticalFiles(int userId, int subjectId);

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json,
            UriTemplate = "/HasSubjectPracticalsJobProtection?subjectId={subjectId}&isActive={isActive}")]
        HasGroupsJobProtectionViewData HasSubjectPracticalsJobProtection(int subjectId, bool isActive);

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json,
            UriTemplate = "/GroupJobProtection?subjectId={subjectId}&groupId={groupId}")]
        GroupJobProtectionViewData GetGroupJobProtection(int subjectId, int groupId);

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json,
            UriTemplate = "/StudentJobProtection?subjectId={subjectId}&groupId={groupId}&studentId={studentId}")]
        StudentJobProtectionViewData GetStudentJobProtection(int subjectId, int groupId, int studentId);
    }
}
