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
        public HttpResponseMessage Get(int diplomProjectId, string lang = "ru")
        {
            var diplomProject =
                new LmPlatformModelsContext().DiplomProjects
                    .Include(x =>
                        x.AssignedDiplomProjects.Select(y => y.Student.Group.Secretary.DiplomPercentagesGraphs))
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

            return Word.DiplomProjectToWord(docName, diplomProject, lang);
        }

        public HttpResponseMessage Get(string lang = "ru", bool isSecretary = false)
        {
            var context = new LmPlatformModelsContext();
            int currentUserId = UserContext.CurrentUserId;
            string currentYear = DateTime.Now.Year.ToString();

            List<LMPlatform.Models.DP.DiplomProject> diplomProjects;
            string archiveName;

            if (isSecretary)
            {
                var secretaryGroupIds = context.Groups
                    .Where(g => g.SecretaryId == currentUserId)
                    .Select(g => g.Id)
                    .ToList();

                diplomProjects = context.DiplomProjects
                    .Where(x => x.AssignedDiplomProjects.Count() == 1)
                    .Where(x => x.AssignedDiplomProjects
                        .Any(adp => secretaryGroupIds.Contains(adp.Student.Group.Id)))
                    .Where(x => x.AssignedDiplomProjects
                        .FirstOrDefault().Student.Group.GraduationYear == currentYear)
                    .Include(x => x.AssignedDiplomProjects.Select(y =>
                        y.Student.Group.Secretary.DiplomPercentagesGraphs))
                    .Include(x => x.Lecturer)
                    .ToList();

                archiveName = "TaskSheets_Secretary.zip";
            }
            else
            {
                diplomProjects = context.DiplomProjects
                    .Where(x => x.LecturerId == currentUserId)
                    .Where(x => x.AssignedDiplomProjects.Count() == 1)
                    .Where(x => x.AssignedDiplomProjects
                        .FirstOrDefault().Student.Group.GraduationYear == currentYear)
                    .Include(x => x.AssignedDiplomProjects.Select(y =>
                        y.Student.Group.Secretary.DiplomPercentagesGraphs))
                    .Include(x => x.Lecturer)
                    .ToList();

                archiveName = "TaskSheets_Lecturer.zip";
            }

            string fileName = diplomProjects.Count > 0 ? archiveName : "NoTaskSheet.zip";
            return Word.DiplomProjectsToArchive(fileName, diplomProjects, lang);
        }
    }
}