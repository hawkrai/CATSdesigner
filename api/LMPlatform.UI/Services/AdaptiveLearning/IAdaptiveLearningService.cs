using LMPlatform.UI.Services.Modules;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using System.Web.Mvc;

namespace LMPlatform.UI.Services.AdaptiveLearning
{
	// NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IAdaptiveLearningService" in both code and config file together.
	[ServiceContract]
	public interface IAdaptiveLearningService
	{
		[OperationContract]
		[WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/GetQuestionsForThema")]
		JsonResult GetQuestionsForThema(int userId, int complexId, int monitoringRes);

		[OperationContract]
		[WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/GetNextThema?userId={userId}&subjectId={subjectId}&complexId={complexId}")]
		AdaptivityViewResult GetNextThema(int userId, int subjectId, int complexId, int currentThemaId);

		[OperationContract]
		[WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/ProcessPredTestResults")]
		void ProcessPredTestResults(int userId, int complexId);

		[OperationContract]
		[WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/SaveSelectedAdaptivityType")]
		void SaveSelectedAdaptivityType(int userId, int complexId, int adaptivityType);
	}
}
