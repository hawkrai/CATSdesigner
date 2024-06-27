﻿using LMPlatform.Models;
using LMPlatform.UI.Services.Modules.Concept;
using System.Collections.Generic;
using System.ServiceModel;
using System.ServiceModel.Web;
using static LMPlatform.UI.Services.Concept.ConceptService;

namespace LMPlatform.UI.Services.Concept
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IConceptService" in both code and config file together.
    [ServiceContract]
    public interface IConceptService
    {
        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/CreateRootConcept")]
        ConceptResult SaveRootConcept(string name, string container, int subjectId, bool includeLabs, bool includeLectures, bool includeTests);

        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/EditRootConcept")]
        ConceptResult EditRootConcept(int elementId, string name, bool isPublished);

        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/AttachSiblings")]
        ConceptResult AttachSiblings(int source, int left, int right);

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/GetConcept?elementId={elementId}")]
        ConceptViewData GetConcept(int elementId);

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/GetRootConcepts?subjectId={subjectId}")]
        ConceptResult GetRootConcepts(int subjectId);

        [OperationContract]
		[WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/GetRootConceptsMobile")]
		ConceptResult GetRootConceptsMobile(int subjectId, int userId, string identityKey);

		[OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/GetConceptTitleInfo?subjectId={subjectId}")]
        ConceptPageTitleData GetConceptTitleInfo(int subjectId);

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/GetConcepts?parentId={parentId}")]
        ConceptResult GetConcepts(int parentId);

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/GetConceptTree?elementId={elementId}")]
        ConceptViewData GetConceptTree(int elementId);

        [OperationContract]
		[WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/GetConceptTreeMobile?elementId={elementId}")]
		ConceptViewData GetConceptTreeMobile(int elementId);

		[OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/Remove")]
        ConceptResult Remove(int elementId);

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/GetNextConceptData?elementId={elementId}")]
        AttachViewData GetNextConceptData(int elementId);

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/GetPrevConceptData?elementId={elementId}")]
        AttachViewData GetPrevConceptData(int elementId);

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/GetConceptViews?conceptId={conceptId}&groupId={groupId}")]
        ConceptService.MonitoringData GetConceptViews(int conceptId, int groupId);

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/GetStudentMonitoringInfo?complexId={complexId}&studentId={studentId}")]
        ConceptStudentMonitoringData GetStudentMonitoringInfo(int complexId, int studentId);

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/GetConceptCascade?parenttId={parenttId}")]
        ConceptResult GetConceptCascade(int parenttId);

        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/AddConcept")]
        ConceptResult AddOrEditConcept(int conceptId, string conceptName, int parentId, bool isGroup, string fileData, int userId);

        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/GetFolderFilesPaths?conceptId={conceptId}")]
        string[] GetFolderFilesPaths(int conceptId);

        [OperationContract]
        [WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/SaveMonitoringResult")]
        void SaveMonitoringResult(int userId, int conceptId, int timeInSeconds);
    }
}
