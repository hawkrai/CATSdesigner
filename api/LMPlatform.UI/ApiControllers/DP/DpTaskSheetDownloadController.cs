using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Application.Infrastructure.Export;
using LMPlatform.Data.Infrastructure;
using System.Data.Entity;
using LMPlatform.UI.Attributes;

namespace LMPlatform.UI.ApiControllers.DP
{
    [JwtAuth]
    public class DpTaskSheetDownloadController : ApiController
    {
        public HttpResponseMessage Get(int diplomProjectId)
        {
            var diplomProject =
                new LmPlatformModelsContext().DiplomProjects
                    .Include(x =>
                        x.AssignedDiplomProjects.Select(y => y.Student.Group.Secretary.CoursePercentagesGraphs))
                    .Single(x => x.DiplomProjectId == diplomProjectId);

            string docName;
            if (diplomProject.AssignedDiplomProjects.Count == 1)
            {
                var stud = diplomProject.AssignedDiplomProjects.Single().Student;
                docName = $"{stud.LastName}_{stud.FirstName}";
            }
            else
            {
                docName = $"{diplomProject.Theme}";
            }


            return Word.DiplomProjectToWord(docName, diplomProject);
        }
    }
}