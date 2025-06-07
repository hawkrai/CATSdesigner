using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LMPlatform.Models;
using LMPlatform.Data.Repositories;
using Application.Core.Data;
using Application.Core;
using Application.Infrastructure.FilesManagement;
using System.Configuration;
using iTextSharp.text.pdf;
using System.IO;
using WMPLib;

namespace Application.Infrastructure.WatchingTimeManagement
{
    public class WatchingTimeService : IWatchingTimeService
    {
        private const int SECONDS_PER_PAGE = 30;

        private readonly LazyDependency<IFilesManagementService> _filesManagementService = 
            new LazyDependency<IFilesManagementService>();

        public IFilesManagementService FilesManagementService
        {
            get { return _filesManagementService.Value; }
        }

        public int GetEstimatedTime(string container)
        {
            var attachments = FilesManagementService.GetAttachments(container);
            if (attachments.Count == 0)
            {
                return 0;
            }

            int totalTime = 0;
            string basePath = ConfigurationManager.AppSettings["FileUploadPath"];

            foreach (var attachment in attachments)
            {
                if (attachment?.PathName == null || attachment?.FileName == null)
                {
                    continue;
                }

                var path = Path.Combine(basePath, attachment.PathName, attachment.FileName);

                if (!File.Exists(path))
                {
                    continue;
                }

                try
                {
                    if (Path.GetExtension(path).Equals(".pdf", StringComparison.OrdinalIgnoreCase))
                    {
                        using var pdfReader = new PdfReader(path);
                        totalTime += pdfReader.NumberOfPages * SECONDS_PER_PAGE;
                    }
                    else
                    {
                        var player = new WindowsMediaPlayer();
                        var clip = player.newMedia(path);
                        totalTime += (int)clip.duration;
                        player.close();
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error processing file {path}: {ex.Message}");
                }
            }

            return totalTime;
        }


        public void SaveWatchingTime(WatchingTime item)
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                var watchingTime = repositoriesContainer.WatchingTimeRepository.GetByUserConceptIds(item.UserId, item.ConceptId);
                //var watchingTime = repositoriesContainer.WatchingTimeRepository.GetByUserConceptIds(item.UserId,item.Concept.Id);
                if (watchingTime != null)
                {
                    watchingTime.Time += item.Time;
                    repositoriesContainer.WatchingTimeRepository.Save(watchingTime);
                }
                else
                {
                    repositoriesContainer.WatchingTimeRepository.Save(item);
                }
                repositoriesContainer.ApplyChanges();
            }
        }

        public WatchingTime GetByConceptSubject(int conceptId, int userId)
        {
            using var repositoriesContainer = new LmPlatformRepositoriesContainer();

            var timeRecords = repositoriesContainer
                .WatchingTimeRepository
                .GetAll(new Query<WatchingTime>()
                 .AddFilterClause(u => u.ConceptId == conceptId && u.UserId == userId))
                .ToList();

            if (timeRecords.Count == 0)
            {
                return null;
            }

            return timeRecords
                .GroupBy(w => new { w.UserId, w.ConceptId })
                .Select(g => new WatchingTime(g.Key.UserId, g.Key.ConceptId, g.Sum(w => w.Time)))
                .FirstOrDefault();
        }


        public List<WatchingTime> GetAllRecords(int conceptId, int? studentId = null)
        {
	        using var repositoriesContainer = new LmPlatformRepositoriesContainer();
	        return repositoriesContainer.WatchingTimeRepository.GetAll(new Query<WatchingTime>().AddFilterClause(u => u.ConceptId == conceptId && u.UserId == (studentId ?? u.UserId))).ToList();
	        //return repositoriesContainer.WatchingTimeRepository.GetAll(new Query<WatchingTime>().AddFilterClause(u => u.Concept.Id == conceptId)).ToList();
        }
    }
}
