using LMPlatform.AdaptiveLearningCore.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMPlatform.AdaptiveLearningCore.Models
{
	public class ConceptThema
	{
		public int ThemaId { get; set; }
		public ThemaResults FinalThemaResult { get; set; }
		public ThemaResume ThemaResume { get; set; }
		public DateTime? DateOfPass { get; set; }
	}
}
