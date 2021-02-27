using Application.Core;
using Application.Core.Data;
using Application.Infrastructure.ConceptManagement;
using Application.Infrastructure.FilesManagement;
using Application.Infrastructure.StudentManagement;
using LMPlatform.Data.Repositories;
using LMPlatform.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Application.Infrastructure.PracticalManagement
{
    public class PracticalManagementService : IPracticalManagementService
    {

		private readonly LazyDependency<IFilesManagementService> _filesManagementService =
			new LazyDependency<IFilesManagementService>();

		private readonly LazyDependency<IConceptManagementService> _conceptManagementService = new LazyDependency<IConceptManagementService>();

		public IConceptManagementService ConceptManagementService => _conceptManagementService.Value;

		public IFilesManagementService FilesManagementService => _filesManagementService.Value;
		public IList<Practical> GetSubjectPracticals(int subjectId)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			return repositoriesContainer.PracticalRepository.GetAll(new Query<Practical>(x => x.SubjectId == subjectId))
				.OrderBy(x => x.Order)
				.ToList();
		}

		public void DeletePracticals(int id)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			var practicals =
				repositoriesContainer.PracticalRepository.GetBy(
					new Query<Practical>(e => e.Id == id).Include(e => e.StudentPracticalMarks));

			var deleteFiles =
				repositoriesContainer.AttachmentRepository.GetAll(
					new Query<Attachment>(e => e.PathName == practicals.Attachments)).ToList();

			var studentPracticalsMarks =
				repositoriesContainer.RepositoryFor<StudentPracticalMark>()
					.GetAll(new Query<StudentPracticalMark>(e => e.PracticalId == id))
					.ToList();

			foreach (var attachment in deleteFiles)
			{
				FilesManagementService.DeleteFileAttachment(attachment);
			}

			foreach (var mark in studentPracticalsMarks)
			{
				repositoriesContainer.RepositoryFor<StudentPracticalMark>().Delete(mark);
			}

			repositoriesContainer.ApplyChanges();

			repositoriesContainer.PracticalRepository.Delete(practicals);

			repositoriesContainer.ApplyChanges();
		}

		public Practical GetPractical(int id)
		{
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				return repositoriesContainer.PracticalRepository.GetBy(new Query<Practical>(e => e.Id == id).Include(e => e.Subject));
			}
		}

		public Practical SavePractical(Practical practical, IList<Attachment> attachments, int userId)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			if (!string.IsNullOrEmpty(practical.Attachments))
			{
				var deleteFiles =
					repositoriesContainer.AttachmentRepository.GetAll(
						new Query<Attachment>(e => e.PathName == practical.Attachments)).ToList().Where(e => attachments.All(x => x.Id != e.Id)).ToList();

				foreach (var attachment in deleteFiles)
				{
					FilesManagementService.DeleteFileAttachment(attachment);
				}
			}
			else
			{
				practical.Attachments = GetGuidFileName();
			}

			FilesManagementService.SaveFiles(attachments.Where(e => e.Id == 0), practical.Attachments);

			foreach (var attachment in attachments)
			{
				if (attachment.Id == 0)
				{
					attachment.PathName = practical.Attachments;
					repositoriesContainer.AttachmentRepository.Save(attachment);
				}
			}

			repositoriesContainer.PracticalRepository.Save(practical);
			repositoriesContainer.ApplyChanges();

			if (practical.IsNew && practical.Subject.SubjectModules.Any(m => m.Module.ModuleType == ModuleType.Practical))
				ConceptManagementService.AttachFolderToLabSection(practical.Theme, userId, practical.SubjectId);

			return practical;
		}

		public void SaveScheduleProtectionPracticalDate(ScheduleProtectionPractical scheduleProtectionPractical)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			repositoriesContainer.RepositoryFor<ScheduleProtectionPractical>().Save(scheduleProtectionPractical);
			repositoriesContainer.ApplyChanges();
		}

		public void SavePracticalVisitingData(List<ScheduleProtectionPracticalMark> protectionPracticalMarks)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			repositoriesContainer.RepositoryFor<ScheduleProtectionPracticalMark>().Save(protectionPracticalMarks);
			repositoriesContainer.ApplyChanges();
		}

		public void SavePracticalMarks(List<StudentPracticalMark> studentPracticalMarks)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			repositoriesContainer.RepositoryFor<StudentPracticalMark>().Save(studentPracticalMarks);
			repositoriesContainer.ApplyChanges();
		}

		public List<string> GetPracticalsAttachments(int subjectId)
		{
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				var model = new List<string>();
				model.AddRange(
					repositoriesContainer.PracticalRepository.GetAll(new Query<Practical>(e => e.SubjectId == subjectId)).Select(e => e.Attachments).ToList());
				return model;
			}
		}

		public Practical UpdatePracticalOrder(Practical practical, int order)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			practical.Order = order;
			repositoriesContainer.PracticalRepository.Save(practical);
			repositoriesContainer.ApplyChanges();
			return practical;
		}


		public List<ScheduleProtectionPractical> GetScheduleProtectionPractical(int subjectId, int groupId)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			var data = repositoriesContainer.RepositoryFor<ScheduleProtectionPractical>()
				.GetAll(new Query<ScheduleProtectionPractical>(e =>
						e.GroupId == groupId && e.SubjectId == subjectId)
					.Include(x => x.ScheduleProtectionPracticalMarks)
					.Include(x => x.ScheduleProtectionPracticalMarks
						.Select(s => s.Student))).ToList();

			return data;
		}

		private string GetGuidFileName()
		{
			return $"P{Guid.NewGuid().ToString("N").ToUpper()}";
		}

        public List<ScheduleProtectionPractical> GetScheduleProtectionPractical(Query<ScheduleProtectionPractical> query)
        {
			using var repositoryContainer = new LmPlatformRepositoriesContainer();
			var data = repositoryContainer.RepositoryFor<ScheduleProtectionPractical>().GetAll(query).ToList();
			return data;
        }

        public List<Practical> GetPracticals(Query<Practical> query)
        {
			using var repositoryContainer = new LmPlatformRepositoriesContainer();
			var data = repositoryContainer.PracticalRepository.GetAll(query).ToList();
			return data;
		}

        public void DeletePracticalScheduleDate(int id)
        {
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			var dateModelmarks =
				repositoriesContainer.RepositoryFor<ScheduleProtectionPracticalMark>()
					.GetAll(new Query<ScheduleProtectionPracticalMark>(e => e.ScheduleProtectionPracticalId == id))
					.ToList();

			foreach (var practicalVisitMark in dateModelmarks)
			{
				repositoriesContainer.RepositoryFor<ScheduleProtectionPracticalMark>().Delete(practicalVisitMark);
			}

			repositoriesContainer.ApplyChanges();

			var dateModel =
				repositoriesContainer.RepositoryFor<ScheduleProtectionPractical>()
					.GetBy(new Query<ScheduleProtectionPractical>(e => e.Id == id));

			repositoriesContainer.RepositoryFor<ScheduleProtectionPractical>().Delete(dateModel);

			repositoriesContainer.ApplyChanges();
		}

        public void SaveStudentPracticalMark(StudentPracticalMark studentPracticalMark)
        {
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			repositoriesContainer.RepositoryFor<StudentPracticalMark>().Save(studentPracticalMark);
			repositoriesContainer.ApplyChanges();
		}
	}
}
