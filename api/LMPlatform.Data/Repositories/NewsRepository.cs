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
    public class NewsRepository : RepositoryBase<LmPlatformModelsContext, SubjectNews>, INewsRepository
    {
        public NewsRepository(LmPlatformModelsContext dataContext)
    : base(dataContext)
        {
        }
		public SubjectNews SaveNews(SubjectNews news)
		{
			using var context = new LmPlatformModelsContext();
			if (news.Id != 0)
			{
				context.Update(news);
			}
			else
			{
				context.Add(news);
			}

			context.SaveChanges();
			return news;
		}

		public void DeleteNews(SubjectNews news)
		{
			using var context = new LmPlatformModelsContext();
			var model = context.Set<SubjectNews>();
			if (model != null)
			{
				context.Delete(model);
				context.SaveChanges();
			}
		}
	}
}
