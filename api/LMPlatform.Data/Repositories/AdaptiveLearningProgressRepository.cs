using Application.Core.Data;
using LMPlatform.Data.Infrastructure;
using LMPlatform.Data.Repositories.RepositoryContracts;
using LMPlatform.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMPlatform.Data.Repositories
{
	public class AdaptiveLearningProgressRepository : RepositoryBase<LmPlatformModelsContext, AdaptiveLearningProgress>, IAdaptiveLearningProgressRepository
	{
		public AdaptiveLearningProgressRepository(LmPlatformModelsContext dataContext) : base(dataContext)
		{
		}
	}
}
