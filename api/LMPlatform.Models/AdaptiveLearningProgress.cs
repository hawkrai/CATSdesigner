using Application.Core.Data;
using System;

namespace LMPlatform.Models
{
	public class AdaptiveLearningProgress : ModelBase
	{
		public int UserId { get; set; }
		public int	SubjectId { get; set; }
		public int	ConceptId { get; set; }
		public int ThemaSolution { get; set; }
		public int? FinalThemaResult { get; set; }
		public DateTime? PassedDate { get; set; }
	}
}
