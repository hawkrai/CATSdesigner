using LMPlatform.AdaptiveLearningCore.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMPlatform.AdaptiveLearningCore.Models
{
	public class PredTestResults
	{
		public int ThemaId { get; set; }
		public int ThemaResult { get; set; }
		public ThemaResume ThemaResume { get; set; }
	}
}
