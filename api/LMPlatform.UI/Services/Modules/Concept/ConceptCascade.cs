using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;

namespace LMPlatform.UI.Services.Modules.Concept
{
	[DataContract]
	public class ConceptCascade
	{
		public ConceptCascade(IEnumerable<Models.Concept> concepts)
		{
			InitCascade(concepts);
		}

		public ConceptCascade(Models.Concept concept)
		{
			ConceptId = concept.Id;
			ConceptName = concept.Name;
			Children = FillCascadeTree(concept.Children);
		}
		public ConceptCascade()
		{
		}

		[DataMember]
		public int ConceptId { get; set; }
		
		[DataMember]		
		public string ConceptName { get; set; }
		
		[DataMember]		
		public IEnumerable<ConceptCascade> Children { get; set; }

		
		private void InitCascade(IEnumerable<Models.Concept> concepts)
		{
			var rootElement = concepts.FirstOrDefault(x => x.ParentId == null);
			if (rootElement != null)
			{
				ConceptId = rootElement.Id;
				ConceptName = rootElement.Name;
				Children = FillCascadeTree(concepts);
			}
		}

		private List<ConceptCascade> FillCascadeTree(IEnumerable<Models.Concept> concepts)
		{
			if (concepts == null)
			{
				return new List<ConceptCascade>();
			}

			return concepts.Select(x => new ConceptCascade()
			{
				ConceptId = x.Id,
				ConceptName = x.Name,
				Children = FillCascadeTree(x.Children)
			}).ToList();
		}
	}
}