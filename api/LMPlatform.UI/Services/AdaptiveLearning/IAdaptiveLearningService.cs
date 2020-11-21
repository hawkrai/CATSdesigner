using LMPlatform.UI.Services.Modules;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Web.Mvc;

namespace LMPlatform.UI.Services.AdaptiveLearning
{
	// NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IAdaptiveLearningService" in both code and config file together.
	[ServiceContract]
	public interface IAdaptiveLearningService
	{
		[OperationContract]
		JsonResult GetQuestionsForThema(int userId, int complexId, int monitoringRes);

		[OperationContract]
		AdaptivityViewResult GetNextThema(int userId, int subjectId, int complexId, int currentThemaId);

		[OperationContract]
		void ProcessPredTestResults(int userId, int complexId);
	}
}
