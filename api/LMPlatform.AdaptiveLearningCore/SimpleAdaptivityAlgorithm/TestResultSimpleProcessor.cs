using LMPlatform.AdaptiveLearningCore.BaseAdaptivityAlgorithm;
using LMPlatform.AdaptiveLearningCore.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMPlatform.AdaptiveLearningCore.SimpleAdaptivityAlgorithm
{
	public class TestResultSimpleProcessor : ITestResultProcessor
	{
		private const int MINIMAL_PERCENT_TO_PASS_TEST = 80;
		
		public ThemaResults GetTestResult(int testResult)
		{
			return testResult > MINIMAL_PERCENT_TO_PASS_TEST ? ThemaResults.WELL_LEARNED : ThemaResults.BAD_LEARNED;
		}
	}
}
