using Application.Core.Data;
using LMPlatform.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMPlatform.Data.Repositories.RepositoryContracts
{
    public interface INewsRepository : IRepositoryBase<SubjectNews>
    {
        SubjectNews SaveNews(SubjectNews news);

        void DeleteNews(SubjectNews news);
    }
}
