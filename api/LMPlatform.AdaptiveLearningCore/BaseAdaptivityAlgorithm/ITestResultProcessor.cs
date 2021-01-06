using LMPlatform.AdaptiveLearningCore.Shared;
using LMPlatform.Models.AdaptivityLearning;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMPlatform.AdaptiveLearningCore.BaseAdaptivityAlgorithm
{
	public interface ITestResultProcessor
	{
		ThemaResults GetTestResult(int testResult);
		
	}
}
