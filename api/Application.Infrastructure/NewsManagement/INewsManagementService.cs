using LMPlatform.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Infrastructure.NewsManagement
{
    public interface INewsManagementService
    {
        IEnumerable<SubjectNews> GetUserNewsByFIO(string fio);
    }
}
