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
		[WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/GetDynamicTestIdForThema")]
		int GetDynamicTestIdForThema(int userId, int subjectId, int complexId, int monitoringRes, int adaptivityType);

		[OperationContract]
		[WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/GetNextThema")]
		AdaptivityViewResult GetNextThema(int userId, int subjectId, int testId, int currentThemaId, int adaptivityType);

		[OperationContract]
		[WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/ProcessPredTestResults")]
		AdaptivityViewResult ProcessPredTestResults(int userId, int testId, int adaptivityType);

		[OperationContract]
		[WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/GetFirstThema?userId={userId}&subjectId={subjectId}&adaptivityType={adaptivityType}")]
		AdaptivityViewResult GetFirstThema(int userId, int subjectId, int adaptivityType);
	}
}
