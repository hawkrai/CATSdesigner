using LMPlatform.UI.Services.Modules.Statistics;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace LMPlatform.UI.Services.Statistics
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IStatisticsService" in both code and config file together.
    [ServiceContract]
    public interface IStatisticsService
    {
        [OperationContract]
        [WebInvoke(UriTemplate = "/GetTeacherStatistics?pager={page}&pageSize={pageSize}", RequestFormat = WebMessageFormat.Json, Method = "GET")]
        TeacherStatisticsViewData GetTeacherStatistics(int page, int pageSize);
    }
}
