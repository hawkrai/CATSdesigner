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
using Application.Core.Helpers;

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

        public HttpResponseMessage Get()
        {
            var diplomProjects =
                new LmPlatformModelsContext().DiplomProjects
                    .Where(x => x.LecturerId == UserContext.CurrentUserId)
                    .Where(x => x.AssignedDiplomProjects.Count() == 1)
                    .Include(x => x.AssignedDiplomProjects.Select(y => y.Student.Group.Secretary.DiplomPercentagesGraphs))
                    .Where(x => x.AssignedDiplomProjects.FirstOrDefault().Student.Group.GraduationYear == "2021").ToList();

            string fileName = "NoTaskSheet.zip";
            if (diplomProjects.Count() > 0)
            {
                fileName = "TaskSheets.zip";
                return Word.DiplomProjectsToArchive(fileName, diplomProjects);
            }
            else
            {
                return Word.DiplomProjectsToArchive(fileName, diplomProjects);
            }
        }
    }
}