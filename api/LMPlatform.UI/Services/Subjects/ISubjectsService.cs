﻿using System.ServiceModel;
using System.ServiceModel.Web;
using LMPlatform.UI.Services.Modules;
using LMPlatform.UI.Services.Modules.Parental;

namespace LMPlatform.UI.Services.Subjects
{
    [ServiceContract]
    public interface ISubjectsService
    {
        [OperationContract]
        [WebInvoke(Method = "PATCH", UriTemplate = "/Subjects", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        SubjectResult Update(SubjectViewData subject);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "/List", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        SubjectsResult GetSubjectsBySession();
    }
}
