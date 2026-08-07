using System;
using System.Diagnostics;
using Application.Core;
using Application.Infrastructure.KnowledgeTestsManagement;
using Quartz;

namespace LMPlatform.UI.Helpers.TaskScheduler.Tasks
{
    [DisallowConcurrentExecution]
    public class CloseExpiredTestsTask : IJob
    {
        public void Execute(IJobExecutionContext context)
        {
            System.Threading.ThreadPool.QueueUserWorkItem(_ =>
            {
                try
                {
                    var testPassingService = UnityWrapper.Resolve<ITestPassingService>();
                    testPassingService.CloseExpiredTests();
                }
                catch (Exception ex)
                {
                    Trace.TraceError("CloseExpiredTestsTask failed: {0}", ex);
                }
            });
        }
    }
}
