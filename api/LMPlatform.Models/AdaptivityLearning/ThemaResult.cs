using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMPlatform.Models.AdaptivityLearning
{
	public class ThemaResult
	{
		public int ThemaId { get; set; }
		public ThemaResults ResultByCurrentThema { get; set; }
		public ThemaSolutions NextStepSolution { get; set; }
		public int? NextThemaId { get; set; }
	}
}
