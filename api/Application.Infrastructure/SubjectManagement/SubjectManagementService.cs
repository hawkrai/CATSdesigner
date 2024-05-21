﻿using System;
using System.Collections.Generic;
using System.Linq;
using Application.Core;
using Application.Core.Data;
using Application.Infrastructure.FilesManagement;
using Application.Infrastructure.StudentManagement;
using LMPlatform.Data.Repositories;
using LMPlatform.Models;
using Application.Infrastructure.ConceptManagement;

namespace Application.Infrastructure.SubjectManagement
{
	using Application.Core.Helpers;
	using Application.Infrastructure.Extensions;
    using Models;

	public class SubjectManagementService : ISubjectManagementService
	{
		private readonly LazyDependency<IStudentManagementService> _studentManagementService = new LazyDependency<IStudentManagementService>();

		private readonly LazyDependency<IFilesManagementService> _filesManagementService =
			new LazyDependency<IFilesManagementService>();

		public IFilesManagementService FilesManagementService => _filesManagementService.Value;

		public IStudentManagementService StudentManagementService => _studentManagementService.Value;

		private readonly LazyDependency<IConceptManagementService> _conceptManagementService = new LazyDependency<IConceptManagementService>();

		public IConceptManagementService ConceptManagementService => _conceptManagementService.Value;

		public List<Subject> GetUserSubjects(int userId)
		{
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				var user = repositoriesContainer.UsersRepository.GetBy(new Query<User>(e => e.Id == userId)
					.Include(e => e.Lecturer)
					.Include(e => e.Student));
				if (user.Student != null)
				{
					return repositoriesContainer.SubjectRepository.GetSubjects(groupId: user.Student.GroupId);
				}
				else
				{
					return repositoriesContainer.SubjectRepository.GetSubjects(lecturerId: user.Lecturer.Id);
				}
			}
		}

		public Subject GetUserSubject(int subjectId, int userId)
        {
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
				var user = repositoriesContainer.UsersRepository.GetBy(new Query<User>(e => e.Id == userId)
					.Include(e => e.Lecturer)
					.Include(e => e.Student));
				if (user.Student != null)
				{
					return repositoriesContainer.SubjectRepository.GetSubject(subjectId, groupId: user.Student.GroupId);
				}
				else
				{
					return repositoriesContainer.SubjectRepository.GetSubject(subjectId, lecturerId: user.Lecturer.Id);
				}
			}
        }

		public bool IsUserAssignedToSubject(int userId, int subjectId)
        {
			var subjects = GetUserSubjectsV2(userId);
			return subjects.Any(subject => subject.Id == subjectId);
        }

		public bool IsUserSubjectOwner(int userId, int subjectId)
        {
			var subjectOwner = GetSubjectOwner(subjectId);
			return subjectOwner != null && subjectOwner.User != null && subjectOwner.User.Id == userId;
        }

		public bool IsUserAssignedToSubjectAndLector(int userId, int subjectId)
		{
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				var user = repositoriesContainer.UsersRepository.GetBy(new Query<User>(e => e.Id == userId)
					.Include(e => e.Lecturer)
					.Include(e => e.Student));
				if (user.Student != null)
				{
					return false;
				}
				else
				{
					return repositoriesContainer.SubjectRepository.GetBy(new Query<Subject>(x => x.Id == subjectId)) != null;
				}
			}
		}

		public List<Subject> GetUserSubjectsV2(int userId)
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                var user = repositoriesContainer.UsersRepository.GetBy(new Query<User>(e => e.Id == userId)
                    .Include(e => e.Lecturer)
                    .Include(e => e.Student));
                if (user.Student != null)
                {
                    return repositoriesContainer.SubjectRepository.GetSubjectsV2(groupId: user.Student.GroupId);
                }
                else
                {
                    return repositoriesContainer.SubjectRepository.GetSubjectsV2(lecturerId: user.Lecturer.Id);
                }
            }
        }


        public List<Subject> GetGroupSubjects(int groupId, bool isArchive = false)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			return repositoriesContainer.SubjectRepository.GetSubjects(groupId: groupId).Where(e => e.IsArchive == isArchive).ToList();
		}

		public List<Subject> GetGroupSubjectsLite(int groupId)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			return repositoriesContainer.SubjectRepository.GetSubjectsLite(groupId).Where(e => !e.IsArchive).ToList();
		}

        public Subject GetGroupSubjectsLiteByName(string groupName)
        {
            using var repositoriesContainer = new LmPlatformRepositoriesContainer();
            return repositoriesContainer.SubjectRepository.GetAll(new Query<Subject>(e => !e.IsArchive && e.Name == groupName)).FirstOrDefault();
        }

        public Subject GetSubject(int id)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			return repositoriesContainer.SubjectRepository
				.GetBy(new Query<Subject>(e => e.Id == id)
				.Include(e => e.SubjectModules.Select(x => x.Module))
				.Include(e => e.SubjectNewses)
				.Include(e => e.Lectures)
				.Include(e => e.Labs)
				.Include(e => e.SubjectLecturers.Select(x => x.Lecturer.User))
				.Include(e => e.Practicals)
				.Include(e => e.LecturesScheduleVisitings)
				.Include(e => e.SubjectGroups.Select(x => x.SubGroups.Select(v => v.ScheduleProtectionLabs))));
		}

		public Subject GetSubject(IQuery<Subject> query)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			return repositoriesContainer.SubjectRepository.GetBy(query);
		}

		public List<Labs> GetLabsV2(int subjectId)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			return repositoriesContainer.LabsRepository.GetAll(new Query<Labs>(e => e.SubjectId == subjectId)).ToList();
		}

		public IPageableList<Subject> GetSubjectsLecturer(int lecturerId, string searchString = null, IPageInfo pageInfo = null, IEnumerable<ISortCriteria> sortCriterias = null)
		{
			var query = new PageableQuery<Subject>(pageInfo, e => e.SubjectLecturers.Any(x => x.LecturerId == lecturerId && x.Owner == null && !e.IsArchive));

			if (!string.IsNullOrEmpty(searchString))
			{
				query.AddFilterClause(
					e => e.Name.ToLower().StartsWith(searchString) || e.Name.ToLower().Contains(searchString));
			}

			query.OrderBy(sortCriterias);
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				return repositoriesContainer.SubjectRepository.GetPageableBy(query);
			}
		}

		public Subject SaveSubject(Subject subject)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			repositoriesContainer.SubjectRepository.Save(subject);
			repositoriesContainer.ApplyChanges();
			return subject;
		}

		public SubjectNews SaveNews(SubjectNews news, IList<Attachment> attachments)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			if (!string.IsNullOrEmpty(news.Attachments))
			{
				var deleteFiles =
					repositoriesContainer.AttachmentRepository.GetAll(
						new Query<Attachment>(e => e.PathName == news.Attachments)).ToList().Where(e => attachments.All(x => x.Id != e.Id)).ToList();

				foreach (var attachment in deleteFiles)
				{
					FilesManagementService.DeleteFileAttachment(attachment);
				}
			}
			else
			{
				news.Attachments = GetGuidFileName();
			}

			FilesManagementService.SaveFiles(attachments.Where(e => e.Id == 0), news.Attachments);

			foreach (var attachment in attachments)
			{
				if (attachment.Id == 0)
				{
					attachment.PathName = news.Attachments;
					attachment.UserId = UserContext.CurrentUserId;
					attachment.CreationDate = DateTime.UtcNow;
					repositoriesContainer.AttachmentRepository.Save(attachment);
				}
			}

			repositoriesContainer.NewsRepository.SaveNews(news);
			repositoriesContainer.ApplyChanges();

			return news;
		}

		public void DeleteNews(int id, int subjectId)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			var news =
				repositoriesContainer.NewsRepository.GetBy(
					new Query<SubjectNews>(e => e.Id == id && e.SubjectId == subjectId));

			var deleteFiles =
				repositoriesContainer.AttachmentRepository.GetAll(
					new Query<Attachment>(e => e.PathName == news.Attachments)).ToList();


			foreach (var attachment in deleteFiles)
			{
				FilesManagementService.DeleteFileAttachment(attachment);
			}

			repositoriesContainer.ApplyChanges();

			repositoriesContainer.NewsRepository.Delete(news);

			repositoriesContainer.ApplyChanges();
		}

		public void DeleteLection(Lectures lectures)
		{
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				var lectModel =
					repositoriesContainer.LecturesRepository.GetBy(new Query<Lectures>(e => e.Id == lectures.Id));
				var deleteFiles =
						repositoriesContainer.AttachmentRepository.GetAll(
							new Query<Attachment>(e => e.PathName == lectModel.Attachments)).ToList();

				foreach (var attachment in deleteFiles)
				{
					FilesManagementService.DeleteFileAttachment(attachment);
				}

				repositoriesContainer.SubjectRepository.DeleteLection(lectures);
				repositoriesContainer.ApplyChanges();
			}
		}

		public void DeleteLectionVisitingDate(int id)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			var dateModelmarks =
				repositoriesContainer.RepositoryFor<LecturesVisitMark>()
					.GetAll(new Query<LecturesVisitMark>(e => e.LecturesScheduleVisitingId == id))
					.ToList();

			foreach (var lecturesVisitMark in dateModelmarks)
			{
				repositoriesContainer.RepositoryFor<LecturesVisitMark>().Delete(lecturesVisitMark);
			}

			repositoriesContainer.ApplyChanges();

			var dateModel =
				repositoriesContainer.RepositoryFor<LecturesScheduleVisiting>()
					.GetBy(new Query<LecturesScheduleVisiting>(e => e.Id == id));

			repositoriesContainer.RepositoryFor<LecturesScheduleVisiting>().Delete(dateModel);

			repositoriesContainer.ApplyChanges();
		}

		public void DeleteLabsVisitingDate(int id)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			var dateModelmarks =
				repositoriesContainer.RepositoryFor<ScheduleProtectionLabMark>()
					.GetAll(new Query<ScheduleProtectionLabMark>(e => e.ScheduleProtectionLabId == id))
					.ToList();

			foreach (var labsVisitMark in dateModelmarks)
			{
				repositoriesContainer.RepositoryFor<ScheduleProtectionLabMark>().Delete(labsVisitMark);
			}

			repositoriesContainer.ApplyChanges();

			var dateModel =
				repositoriesContainer.RepositoryFor<ScheduleProtectionLabs>()
					.GetBy(new Query<ScheduleProtectionLabs>(e => e.Id == id));

			repositoriesContainer.RepositoryFor<ScheduleProtectionLabs>().Delete(dateModel);

			repositoriesContainer.ApplyChanges();
		}

		public void DeleteLabs(int id)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			var labs =
				repositoriesContainer.LabsRepository.GetBy(
					new Query<Labs>(e => e.Id == id).Include(e => e.StudentLabMarks));

			var deleteFiles =
				repositoriesContainer.AttachmentRepository.GetAll(
					new Query<Attachment>(e => e.PathName == labs.Attachments)).ToList();

			var studentLabMarks =
				repositoriesContainer.RepositoryFor<StudentLabMark>()
					.GetAll(new Query<StudentLabMark>(e => e.LabId == id))
					.ToList();

			var deleteLabFiles = repositoriesContainer.RepositoryFor<UserLabFiles>()
                .GetAll(new Query<UserLabFiles>(e => e.LabId == id))
                .ToList();

			foreach (var attachment in deleteFiles)
			{
				FilesManagementService.DeleteFileAttachment(attachment);
			}

			foreach (var mark in studentLabMarks)
			{
				repositoriesContainer.RepositoryFor<StudentLabMark>().Delete(mark);
			}

            foreach (var labFile in deleteLabFiles)
            {
				repositoriesContainer.RepositoryFor<UserLabFiles>().Delete(labFile);
			}

			repositoriesContainer.ApplyChanges();

			repositoriesContainer.LabsRepository.Delete(labs);

			repositoriesContainer.ApplyChanges();
		}

		public bool IsWorkingSubject(int userId, int subjectId)
		{
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				var subjectlect =
					repositoriesContainer.RepositoryFor<SubjectLecturer>()
						.GetAll(new Query<SubjectLecturer>(e => e.LecturerId == userId && e.SubjectId == subjectId))
						.ToList();

				return subjectlect.Any();
			}
		}
		
		public SubjectNews GetNews(int id, int subjectId)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			return repositoriesContainer.SubjectRepository
				.GetBy(new Query<Subject>(e => e.Id == subjectId).Include(e => e.SubjectNewses))
				.SubjectNewses
				.FirstOrDefault(e => e.Id == id);
		}

		public List<SubjectNews> GetNewsByGroup(int id)
		{
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				var subjects =
					repositoriesContainer.RepositoryFor<SubjectGroup>().GetAll(new Query<SubjectGroup>(e => e.GroupId == id && e.IsActiveOnCurrentGroup)).Select(
						e => e.SubjectId).ToList();

				var subjectsData =
					repositoriesContainer.RepositoryFor<SubjectGroup>().GetAll(new Query<SubjectGroup>(e => e.GroupId == id && e.IsActiveOnCurrentGroup).Include(e => e.Subject)).ToList();

				var news =
					repositoriesContainer.RepositoryFor<SubjectNews>().GetAll(
						new Query<SubjectNews>(e => subjects.Contains(e.SubjectId) && !e.Disabled)).ToList();

				foreach (var subjectNewse in news)
				{
					var subject = subjectsData.FirstOrDefault(e => e.SubjectId == subjectNewse.SubjectId).Subject;
					subjectNewse.Subject = new Subject
					{
						Name = subject.Name,
						Color = subject.Color,
						ShortName = subject.ShortName
					};
				}

				return news;
			}
		}

		public List<SubjectNews> GetNewsByLector(int id)
		{
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				var subjects =
					repositoriesContainer.RepositoryFor<SubjectLecturer>().GetAll(new Query<SubjectLecturer>(e => e.LecturerId == id)).Select(
						e => e.SubjectId).ToList();

				var subjectsData =
					repositoriesContainer.RepositoryFor<SubjectLecturer>().GetAll(new Query<SubjectLecturer>(e => e.LecturerId == id).Include(e => e.Subject)).ToList();

				var news =
					repositoriesContainer.RepositoryFor<SubjectNews>().GetAll(
						new Query<SubjectNews>(e => subjects.Contains(e.SubjectId) && !e.Disabled)).ToList();

				foreach (var subjectNewse in news)
				{
					var subject = subjectsData.FirstOrDefault(e => e.SubjectId == subjectNewse.SubjectId).Subject;
					subjectNewse.Subject = new Subject
												{
													Name = subject.Name,
													Color = subject.Color,
													ShortName = subject.ShortName
												};
				}

				return news;
			}
		}

		public IList<SubGroup> GetSubGroups(int subjectId, int groupId)
		{
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				var subjectGroup =
					repositoriesContainer.SubjectRepository.GetBy(
						new Query<Subject>(e => e.Id == subjectId && e.SubjectGroups.Any(x => x.GroupId == groupId))
						.Include(e => e.SubjectGroups.Select(x => x.SubGroups.Select(c => c.SubjectStudents.Select(t => t.Student.ScheduleProtectionLabMarks))))
						.Include(e => e.SubjectGroups.Select(x => x.SubGroups.Select(c => c.SubjectStudents.Select(t => t.Student.ScheduleProtectionPracticalMarks))))
						.Include(e => e.SubjectGroups.Select(x => x.SubGroups.Select(c => c.SubjectStudents.Select(t => t.Student.StudentLabMarks))))
						.Include(e => e.SubjectGroups.Select(x => x.SubGroups.Select(c => c.SubjectStudents.Select(t => t.Student.User))))
						.Include(e => e.SubjectGroups.Select(x => x.SubGroups.Select(c => c.SubjectStudents.Select(t => t.Student.StudentPracticalMarks))))
						.Include(e => e.SubjectGroups.Select(x => x.SubGroups.Select(c => c.ScheduleProtectionLabs))));
				return subjectGroup.SubjectGroups.First(e => e.GroupId == groupId).SubGroups.ToList();
			}
		}

		public IList<SubGroup> GetSubGroupsV2(int subjectId, int groupId)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			var subjectGroup =
				repositoriesContainer.SubjectRepository.GetBy(
					new Query<Subject>(e => e.Id == subjectId && e.SubjectGroups.Any(x => x.GroupId == groupId))
						.Include(e => e.SubjectGroups.Select(x => x.SubGroups.Select(c => c.SubjectStudents))));
						
			return subjectGroup.SubjectGroups.First(e => e.GroupId == groupId).SubGroups.ToList();
		}

		public IList<SubGroup> GetSubGroupsV3(int subjectId, int groupId)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			var subjectGroup =
				repositoriesContainer.SubjectRepository
					.GetBy(new Query<Subject>(e => e.Id == subjectId && e.SubjectGroups.Any(x => x.GroupId == groupId))
						.Include(e => e.SubjectGroups.Select(x => x.SubGroups.Select(c => c.SubjectStudents.Select(t => t.Student.User)))));

            if (subjectGroup?.SubjectGroups?.FirstOrDefault(e => e.GroupId == groupId)?.SubGroups == null)
            {
                return new List<SubGroup>();
            }

			return subjectGroup.SubjectGroups.First(e => e.GroupId == groupId).SubGroups.ToList();
		}

		public IList<SubGroup> GetSubGroupsV4(int subjectId, int groupId)
        {
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			var subjectGroup =
				repositoriesContainer.SubjectRepository
					.GetBy(new Query<Subject>(e => e.Id == subjectId && e.SubjectGroups.Any(x => x.GroupId == groupId))
						.Include(e => e.SubjectGroups.Select(x => x.SubGroups.Select(c => c.SubjectStudents)))
						.Include(e => e.SubjectGroups.Select(x => x.SubGroups.Select(c => c.ScheduleProtectionLabs))));

			return subjectGroup.SubjectGroups.First(e => e.GroupId == groupId).SubGroups.ToList();
		}

		public IList<SubGroup> GetSubGroupsV2WithScheduleProtectionLabs(int subjectId, int groupId)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			var subjectGroup =
				repositoriesContainer.RepositoryFor<SubjectGroup>().GetBy(
					new Query<SubjectGroup>(e => e.GroupId == groupId && e.SubjectId == subjectId)
						.Include(e => e.SubGroups.Select(c => c.ScheduleProtectionLabs.Select(x => x.Lecturer.User)))
						.Include(e => e.SubjectStudents));
						
			return subjectGroup.SubGroups.Where(x => x.SubjectStudents?.Count > 0).ToList();
		}

		public void SaveSubGroup(int subjectId, int groupId, IList<int> firstInts, IList<int> secoInts, IList<int> thirdInts)
		{
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				var subject = repositoriesContainer.SubjectRepository.GetBy(new Query<Subject>(e => e.Id == subjectId && e.SubjectGroups.Any(x => x.GroupId == groupId)).Include(e => e.SubjectGroups.Select(x => x.SubGroups)));
				var firstOrDefault = subject.SubjectGroups.FirstOrDefault(e => e.GroupId == groupId);
				if (firstOrDefault.SubGroups.Any())
				{
					repositoriesContainer.SubGroupRepository.SaveStudents(subjectId, firstOrDefault.Id, firstInts, secoInts, thirdInts);
				}
				else
				{
					repositoriesContainer.SubGroupRepository.CreateSubGroup(subjectId, firstOrDefault.Id, firstInts, secoInts, thirdInts);
				}
			}
		}

		public Lectures GetLectures(int id)
		{
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				return repositoriesContainer.LecturesRepository.GetBy(new Query<Lectures>(e => e.Id == id).Include(e => e.Subject));
			}
		}

		public Labs SaveLabs(Labs labs, IList<Attachment> attachments, int userId)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			if (!string.IsNullOrEmpty(labs.Attachments))
			{
				var deleteFiles =
					repositoriesContainer.AttachmentRepository.GetAll(
						new Query<Attachment>(e => e.PathName == labs.Attachments)).ToList().Where(e => attachments.All(x => x.Id != e.Id)).ToList();

				foreach (var attachment in deleteFiles)
				{
					FilesManagementService.DeleteFileAttachment(attachment);
				}
			}
			else
			{
				labs.Attachments = GetGuidFileName();
			}

			FilesManagementService.SaveFiles(attachments.Where(e => e.Id == 0), labs.Attachments);

			foreach (var attachment in attachments)
			{
				if (attachment.Id == 0)
				{
					attachment.PathName = labs.Attachments;
					attachment.UserId = UserContext.CurrentUserId;
					attachment.CreationDate = DateTime.UtcNow;
					repositoriesContainer.AttachmentRepository.Save(attachment);
				}
			}

			repositoriesContainer.LabsRepository.Save(labs);
			repositoriesContainer.ApplyChanges();

			if (labs.IsNew && labs.Subject.SubjectModules.All(m => m.Module.ModuleType != ModuleType.Practical) &&
			    labs.Subject.SubjectModules.Any(m => m.Module.ModuleType == ModuleType.Labs))
				ConceptManagementService.AttachFolderToLabSection(labs.Theme, userId, labs.SubjectId);

			return labs;
		}

		public UserLabFiles SaveUserLabFiles(UserLabFiles userLabFiles, IList<Attachment> attachments)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			if (!string.IsNullOrEmpty(userLabFiles.Attachments))
			{
				var deleteFiles =
					repositoriesContainer.AttachmentRepository.GetAll(
						new Query<Attachment>(e => e.PathName == userLabFiles.Attachments)).ToList().Where(e => attachments.All(x => x.Id != e.Id)).ToList();

				foreach (var attachment in deleteFiles)
				{
					FilesManagementService.DeleteFileAttachment(attachment);
				}
			}
			else
			{
				userLabFiles.Attachments = GetGuidFileName();
			}

			FilesManagementService.SaveFiles(attachments.Where(e => e.Id == 0), userLabFiles.Attachments);

			foreach (var attachment in attachments)
			{
				if (attachment.Id == 0)
				{
					attachment.PathName = userLabFiles.Attachments;
					attachment.UserId = UserContext.CurrentUserId;
					attachment.CreationDate = DateTime.UtcNow;
					repositoriesContainer.AttachmentRepository.Save(attachment);
				}
			}

            if (userLabFiles.LabId.HasValue)
            {
                userLabFiles.Lab = repositoriesContainer.LabsRepository.GetBy(new Query<Labs>(x => x.Id == userLabFiles.LabId));

			} else if (userLabFiles.PracticalId.HasValue)
            {
                userLabFiles.Practical =
                    repositoriesContainer.PracticalRepository.GetBy(new Query<Practical>(x =>
                        x.Id == userLabFiles.PracticalId));

            }
			repositoriesContainer.RepositoryFor<UserLabFiles>().Save(userLabFiles);
			repositoriesContainer.ApplyChanges();

			return userLabFiles;
		}

		public Labs GetLabs(int id)
		{
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				return repositoriesContainer.LabsRepository.GetBy(new Query<Labs>(e => e.Id == id).Include(e => e.Subject));
			}
		}

		public void SaveDateLectures(int subjectId, DateTime date)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			repositoriesContainer.RepositoryFor<LecturesScheduleVisiting>().Save(new LecturesScheduleVisiting
			{
				Date = date,
				SubjectId = subjectId
			});
			repositoriesContainer.ApplyChanges();
		}


		public List<LecturesScheduleVisiting> GetScheduleVisitings(Query<LecturesScheduleVisiting> query)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			return repositoriesContainer.RepositoryFor<LecturesScheduleVisiting>()
					.GetAll(query)
					.ToList();
		}

		public void SaveMarksCalendarData(List<LecturesVisitMark> lecturesVisitMarks)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			repositoriesContainer.RepositoryFor<LecturesVisitMark>().Save(lecturesVisitMarks);
			repositoriesContainer.ApplyChanges();
		}

		public void SaveScheduleProtectionLabsDate(int subGroupId, DateTime date)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			repositoriesContainer.RepositoryFor<ScheduleProtectionLabs>().Save(new ScheduleProtectionLabs
			{
				SuGroupId = subGroupId,
				Date = date,
				Id = 0
			});
			repositoriesContainer.ApplyChanges();
		}

		public SubGroup GetSubGroup(int subGroupId)
		{
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				return
					repositoriesContainer.RepositoryFor<SubGroup>().GetBy(new Query<SubGroup>(e => e.Id == subGroupId)
					.Include(e => e.SubjectStudents.Select(x => x.Student.ScheduleProtectionLabMarks)).Include(e => e.SubjectGroup.Group));
			}
		}

		public Group GetGroup(int groupId)
		{
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				return
					repositoriesContainer.RepositoryFor<Group>().GetBy(new Query<Group>(e => e.Id == groupId)
					.Include(e => e.Students.Select(x => x.ScheduleProtectionLabMarks)));
			}
		}

		public void SaveLabsVisitingData(ScheduleProtectionLabMark protectionLabMarks)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			repositoriesContainer.RepositoryFor<ScheduleProtectionLabMark>().Save(protectionLabMarks);
			repositoriesContainer.ApplyChanges();
		}

		public void SavePracticalVisitingData(ScheduleProtectionPracticalMark protectionPracticalMarks)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			repositoriesContainer.RepositoryFor<ScheduleProtectionPracticalMark>().Save(protectionPracticalMarks);
			repositoriesContainer.ApplyChanges();
		}

		public void SaveStudentLabsMark(StudentLabMark studentLabMark)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			repositoriesContainer.RepositoryFor<StudentLabMark>().Save(studentLabMark);
			repositoriesContainer.ApplyChanges();
		}

		public void RemoveStudentLabsMark(int id)
        {
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			var repository = repositoriesContainer.RepositoryFor<StudentLabMark>();
			var studentLabMark = repository.GetBy(new Query<StudentLabMark>(x => x.Id == id));
			repository.Delete(studentLabMark);
			repositoriesContainer.ApplyChanges();

		}

		public List<string> GetLecturesAttachments(int subjectId)
		{
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				var model = new List<string>();
				model.AddRange(
					repositoriesContainer.LecturesRepository.GetAll(new Query<Lectures>(e => e.SubjectId == subjectId)).Select(e => e.Attachments).ToList());
				return model;
			}
		}

		public List<string> GetLabsAttachments(int subjectId)
		{
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				var model = new List<string>();
				model.AddRange(
					repositoriesContainer.LabsRepository.GetAll(new Query<Labs>(e => e.SubjectId == subjectId)).Select(e => e.Attachments).ToList());
				return model;
			}
		}

		public IEnumerable<string> GetSubjectAttachments(int subjectId)
        {
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			var subject = repositoriesContainer.SubjectRepository.GetBy(
				new Query<Subject>(e => e.Id == subjectId)
				.Include(s => s.Labs)
				.Include(s => s.Practicals)
				.Include(s => s.SubjectNewses)
				.Include(s => s.Lectures));

			return subject.Lectures.Select(x => x.Attachments)
				.Concat(subject.Labs.Select(x => x.Attachments))
				.Concat(subject.Practicals.Select(x => x.Attachments));

		}

		public List<string> GetNewsAttachments(int subjectId)
        {
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			return repositoriesContainer.NewsRepository.GetAll(new Query<SubjectNews>(e => e.SubjectId == subjectId)).Select(e => e.Attachments).ToList();
        }

		public void DeleteSubject(int id)
		{
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				var model = repositoriesContainer.SubjectRepository.GetBy(new Query<Subject>(e => e.Id == id));
				model.IsArchive = true;
				repositoriesContainer.SubjectRepository.Save(model);
				repositoriesContainer.ApplyChanges();
			}
		}

		public List<Subject> GetSubjects()
		{
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				return repositoriesContainer.SubjectRepository.GetAll().ToList();
			}
		}

		public List<UserLabFiles> GetUserFiles(int userId, int subjectId)
        	{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			if (userId == 0)
			{
				return repositoriesContainer.RepositoryFor<UserLabFiles>().GetAll(new Query<UserLabFiles>(e => e.SubjectId == subjectId)).ToList();
			}

			return repositoriesContainer.RepositoryFor<UserLabFiles>().GetAll(new Query<UserLabFiles>(e => e.UserId == userId && e.SubjectId == subjectId)).ToList();
		}
  
		public List<UserLabFiles> GetUserLabFiles(int userId, int subjectId)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			if (userId == 0)
			{
				return repositoriesContainer.RepositoryFor<UserLabFiles>().GetAll(new Query<UserLabFiles>(e => e.SubjectId == subjectId && (e.LabId.Value > 0 || e.LabId.Value <= 0 && e.PracticalId.Value <= 0) && !e.IsCoursProject)).ToList();
			}

			return repositoriesContainer.RepositoryFor<UserLabFiles>().GetAll(new Query<UserLabFiles>(e => e.UserId == userId && e.SubjectId == subjectId && (e.LabId.Value > 0 || e.LabId.Value <= 0 && e.PracticalId.Value <= 0) && !e.IsCoursProject)).ToList();
		}

        public List<UserLabFiles> GetUserPracticalFiles(int userId, int subjectId)
        {
            using var repositoriesContainer = new LmPlatformRepositoriesContainer();
            if (userId == 0)
            {
                return repositoriesContainer.RepositoryFor<UserLabFiles>().GetAll(new Query<UserLabFiles>(e => e.SubjectId == subjectId && e.PracticalId.Value > 0)).ToList();
            }

            return repositoriesContainer.RepositoryFor<UserLabFiles>().GetAll(new Query<UserLabFiles>(e => e.UserId == userId && e.SubjectId == subjectId && e.PracticalId.Value > 0)).ToList();
        }

		public List<UserLabFiles> GetUserCourseFiles(int userId, int subjectId)
        {
            using var repositoriesContainer = new LmPlatformRepositoriesContainer();
            if (userId == 0)
            {
                return repositoriesContainer.RepositoryFor<UserLabFiles>().GetAll(new Query<UserLabFiles>(e => e.SubjectId == subjectId && e.IsCoursProject)).ToList();
            }

            return repositoriesContainer.RepositoryFor<UserLabFiles>().GetAll(new Query<UserLabFiles>(e => e.UserId == userId && e.SubjectId == subjectId && e.IsCoursProject)).ToList();
		}

		public UserLabFiles GetUserLabFile(int id)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			return repositoriesContainer.RepositoryFor<UserLabFiles>().GetBy(new Query<UserLabFiles>(e => e.Id == id));
		}

		public UserLabFiles GetUserLabFile(string path)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			return repositoriesContainer.RepositoryFor<UserLabFiles>().GetBy(new Query<UserLabFiles>(e => e.Attachments == path));
		}

		public void DeleteUserLabFile(int id)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			var model = repositoriesContainer.RepositoryFor<UserLabFiles>()
				.GetBy(new Query<UserLabFiles>(e => e.Id == id));
			repositoriesContainer.RepositoryFor<UserLabFiles>().Delete(model);
			repositoriesContainer.ApplyChanges();
		}

		public void DeleteNonReceivedUserFiles(int groupId)
		{
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				var studentsIds = repositoriesContainer.RepositoryFor<Student>()
					.GetAll(new Query<Student>(e => e.GroupId == groupId)).Select(x => x.User.Id).ToList();

				foreach (var studentId in studentsIds)
				{
					var model = repositoriesContainer.RepositoryFor<UserLabFiles>().
						GetAll(new Query<UserLabFiles>(e => e.UserId == studentId && !e.IsReceived));
					repositoriesContainer.RepositoryFor<UserLabFiles>().Delete(model);
				}

				repositoriesContainer.ApplyChanges();
			}
		}

	    public void DeleteNonReceivedUserFiles(int groupId, int subjectId)
	    {
	        using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
	        {
	            var studentsIds = repositoriesContainer.RepositoryFor<Student>()
	                .GetAll(new Query<Student>(e => e.GroupId == groupId)).Select(x => x.User.Id).ToList();

	            foreach (var studentId in studentsIds)
	            {
	                var model = repositoriesContainer.RepositoryFor<UserLabFiles>().
	                    GetAll(new Query<UserLabFiles>(e => e.UserId == studentId && !e.IsReceived && e.SubjectId == subjectId));
	                repositoriesContainer.RepositoryFor<UserLabFiles>().Delete(model);
                }

	            repositoriesContainer.ApplyChanges();
	        }
        }

	    public Lectures SaveLectures(Lectures lectures, IList<Attachment> attachments, Int32 userId)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();

			if (!string.IsNullOrEmpty(lectures.Attachments))
			{
				var deleteFiles =
					repositoriesContainer.AttachmentRepository.GetAll(
						new Query<Attachment>(e => e.PathName == lectures.Attachments)).ToList().Where(e => attachments.All(x => x.Id != e.Id)).ToList();

				foreach (var attachment in deleteFiles)
				{
					FilesManagementService.DeleteFileAttachment(attachment);
				}
			}
			else
			{
				lectures.Attachments = GetGuidFileName();
			}

			FilesManagementService.SaveFiles(attachments.Where(e => e.Id == 0), lectures.Attachments);

			foreach (var attachment in attachments)
			{
				if (attachment.Id == 0)
				{
					attachment.PathName = lectures.Attachments;
					attachment.UserId = UserContext.CurrentUserId;
					attachment.CreationDate = DateTime.UtcNow;
					repositoriesContainer.AttachmentRepository.Save(attachment);
				}
			}
			repositoriesContainer.LecturesRepository.Save(lectures);
			repositoriesContainer.ApplyChanges();

			if (lectures.IsNew && lectures.Subject.SubjectModules.Any(s => s.Module.ModuleType == ModuleType.Lectures))
				ConceptManagementService.AttachFolderToLectSection(lectures.Theme, userId, lectures.SubjectId);

			return lectures;
		}

		public void UpdateLecturesOrder(int subjectId, int prevIndex, int curIndex)
        {
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();

			var lectures = GetSubjectLectures(subjectId);

			foreach (var lecture in lectures.MoveItem(prevIndex, curIndex).Select((x, index) => new { Value = x, Index = index }))
			{
				lecture.Value.Order = lecture.Index;
				repositoriesContainer.LecturesRepository.Save(lecture.Value);
			}

			repositoriesContainer.ApplyChanges();

		}

		public void UpdateLabsOrder(int subjectId, int prevIndex, int curIndex)
        {
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();

			var labs = GetSubjectLabs(subjectId);

			foreach(var lab in labs.MoveItem(prevIndex, curIndex).Select((x, index) => new { Value = x, Index = index }))
            {
				var order = lab.Index + 1;
				lab.Value.Order = order;
				lab.Value.ShortName = order.ToString();
				repositoriesContainer.LabsRepository.Save(lab.Value);
			}

			repositoriesContainer.ApplyChanges();
        }

		private string GetGuidFileName()
		{
			return $"P{Guid.NewGuid().ToString("N").ToUpper()}";
		}

		public bool IsSubjectName(string name, string id, int userId)
		{
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				return repositoriesContainer.SubjectRepository.IsSubjectName(name, id, userId);
			}
		}

		public bool IsSubjectShortName(string name, string id, int userId)
		{
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				return repositoriesContainer.SubjectRepository.IsSubjectShortName(name, id, userId);
			}
		}

		public void DisableNews(int subjectId, bool disable)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			repositoriesContainer.SubjectRepository.DisableNews(subjectId, disable);
		}

		public List<ProfileCalendarModel> GetLabEvents(int userId)
		{
			var model = new List<ProfileCalendarModel>();
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				var subjects = repositoriesContainer.SubjectRepository.GetSubjects(lecturerId: userId);

				foreach (var subject in subjects)
				{
					var name = subject.ShortName;

					foreach (var group in subject.SubjectGroups)
					{
						foreach (var subGroup in group.SubGroups)
						{
							foreach (var scheduleProtectionLabse in subGroup.ScheduleProtectionLabs)
							{
								model.Add(new ProfileCalendarModel()
										 {
											 Start = scheduleProtectionLabse.Date.ToString("yyyy-MM-dd"),
											 Title = string.Format("{0} -  Лаб.работа (Гр. {1})", name, group.Group.Name),
											 SubjectId = subject.Id,
											 Color = subject.Color
										 });
							}
						}
					}
				}
			}

			return model;
		}

		public List<ProfileCalendarModel> GetGroupsLabEvents(int groupId, int userId)
		{
			var model = new List<ProfileCalendarModel>();
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				var subjects = repositoriesContainer.SubjectRepository.GetSubjects(groupId: groupId);

				foreach (var subject in subjects)
				{
					var name = subject.ShortName;

					foreach (var group in subject.SubjectGroups)
					{
						foreach (var subGroup in group.SubGroups.Where(e => e.SubjectStudents.Any(x => x.StudentId == userId)))
						{
							foreach (var scheduleProtectionLabse in subGroup.ScheduleProtectionLabs)
							{
								model.Add(new ProfileCalendarModel()
											{
												Start = scheduleProtectionLabse.Date.ToString("yyyy-MM-dd"),
												Title = string.Format("{0} -  Лаб.работа", name),
												SubjectId = subject.Id,
												Color = subject.Color
											});
							}
						}
					}
				}
			}

			return model;
		}

		public void UpdateUserFile(int userFileId, bool isReceived = false, bool isReturned = false)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			var userFile = repositoriesContainer.RepositoryFor<UserLabFiles>()
				.GetBy(new Query<UserLabFiles>(e => e.Id == userFileId));
			userFile.IsReceived = isReceived;
			userFile.IsReturned = isReturned;
			repositoriesContainer.RepositoryFor<UserLabFiles>().Save(userFile);
		}

		public List<ProfileCalendarModel> GetLecturesEvents(int userId)
		{
			var model = new List<ProfileCalendarModel>();
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				var subjects = repositoriesContainer.SubjectRepository.GetSubjects(lecturerId: userId);

				foreach (var subject in subjects)
				{
					var name = subject.ShortName;

					foreach (var lecturesScheduleVisiting in subject.LecturesScheduleVisitings)
					{
						model.Add(new ProfileCalendarModel()
						{
							Start = lecturesScheduleVisiting.Date.ToString("yyyy-MM-dd"),
							Title = string.Format("{0} -  Лекция", name),
							Color = subject.Color,
							SubjectId = subject.Id,
						});
					}
				}
			}

			return model;
		}

		public List<ProfileCalendarModel> GetLecturesEvents(int groupId, int userId)
		{
			var model = new List<ProfileCalendarModel>();
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				var subjects = repositoriesContainer.SubjectRepository.GetSubjects(groupId);

				foreach (var subject in subjects)
				{
					var name = subject.ShortName;

					foreach (var lecturesScheduleVisiting in subject.LecturesScheduleVisitings)
					{
						model.Add(new ProfileCalendarModel()
						{
							Start = lecturesScheduleVisiting.Date.ToString("yyyy-MM-dd"),
							Title = string.Format("{0} -  Лекция", name),
							Color = subject.Color,
							SubjectId = subject.Id,
						});
					}
				}
			}

			return model;
		}

        public List<Subject> GetSubjectsByLector(int userId, bool isArchive = false)
		{
			List<Subject> model;

			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				model = repositoriesContainer.SubjectRepository.GetSubjects(lecturerId: userId).Where(e => e.IsArchive == isArchive).ToList();
			}

			return model;
		}

		public List<Subject> GetSubjectsInfoByLector(int userId, bool isArchive = false)
		{
			List<Subject> model;

			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				model = repositoriesContainer.SubjectRepository.GetSubjectsInfoByLecturerId(lecturerId: userId).Where(e => e.IsArchive == isArchive).ToList();
			}

			return model;
		}

		public List<Subject> GetSubjectsByLectorOwner(int userId, bool lite = false)
		{
			IQuery<SubjectLecturer> query = new Query<SubjectLecturer>(e => e.LecturerId == userId && e.Owner == null);
			if (!lite)
			{
				query = query
					.Include(e => e.Subject.SubjectGroups.Select(x => x.SubjectStudents))
					.Include(e => e.Subject.LecturesScheduleVisitings)
					.Include(e => e.Subject.Labs)
					.Include(
						e => e.Subject.SubjectGroups
							.Select(x => x.SubGroups.Select(t => t.ScheduleProtectionLabs)));
			}
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			var model = repositoriesContainer.RepositoryFor<SubjectLecturer>()
				.GetAll(query)
				.Select(e => e.Subject)
				.Where(e => !e.IsArchive)
				.ToList();
			return model;
		}

		public List<Subject> GetSubjectsByStudent(int userId, bool isArchive)
		{
			List<Subject> model;

			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				var student = repositoriesContainer.StudentsRepository.GetStudent(userId);
				model = repositoriesContainer.SubjectRepository.GetAllSubjectsForGroup(student.GroupId).Where(e => e.IsArchive == isArchive).ToList();
			}

			return model;
		}

		public int GetSubjectsCountByStudent(int userId, bool isActive)
		{
			int count;

			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				var student = repositoriesContainer.StudentsRepository.GetStudent(userId);
				return repositoriesContainer.SubjectRepository.GetSubjectsCountByGroupId(student.GroupId, isActive);
			}
		}

		public List<Subject> GetSubjectsInfoByStudent(int userId)
		{
			List<Subject> model;

			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				var student = repositoriesContainer.StudentsRepository.GetStudent(userId);
				model = repositoriesContainer.SubjectRepository.GetSubjectsInfoByGroupId(groupId: student.GroupId).ToList();
			}

			return model;
		}

		public List<Subject> GetAllSubjectsByStudent(int userId)
		{
			List<Subject> model;

			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				var student = repositoriesContainer.StudentsRepository.GetStudent(userId);
				model = repositoriesContainer.SubjectRepository.GetAllSubjectsForGroup(student.GroupId).ToList();
			}

			return model;
		}

		public List<Subject> GetSubjectsInfoByGroup(int Id) { 
			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				return repositoriesContainer.SubjectRepository.GetAllSubjectsForGroup(Id).ToList();
			}
		}

		public int LabsCountByStudent(int userId)
		{
			var count = 0;

			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				var student = repositoriesContainer.StudentsRepository.GetStudent(userId);
				var subjects = repositoriesContainer.SubjectRepository.GetSubjects(groupId: student.GroupId).Where(e => !e.IsArchive).ToList();

				count += subjects.Sum(subject => subject.Labs.Count);
			}

			return count;
		}

		public int LabsCountByLector(int userId)
		{
			var count = 0;

			using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			{
				var subjects = repositoriesContainer.SubjectRepository.GetSubjects(lecturerId: userId).Where(e => !e.IsArchive).ToList();

				count += subjects.Sum(subject => subject.Labs.Count);
			}

			return count;
		}

		public int StudentAttendance(int userId)
		{
			int count = 0;

			//using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
			//{
			//    var user =
			//        repositoriesContainer.StudentsRepository.GetBy(
			//            new Query<Student>(e => e.Id == userId).Include(
			//                e => e.ScheduleProtectionLabMarks.Select(x => x.ScheduleProtectionLab)));

			//    var hours = 0;

			//    foreach (var scheduleProtectionLabMark in user.ScheduleProtectionLabMarks)
			//    {
			//        if (!string.IsNullOrEmpty(scheduleProtectionLabMark.Mark))
			//        {
			//            //hours   
			//        }   
			//    }

			//    if (isDate)
			//    {
			//        var numberDates = dates.Count;
			//        dates.Sort((a, b) => a.CompareTo(b));
			//        var nowDate = DateTime.Now.Date;

			//        var countDone = 0;

			//        foreach (var dateTime in dates)
			//        {
			//            if (nowDate > dateTime)
			//            {
			//                countDone += 1;
			//            }
			//        }

			//        count = Math.Round(((decimal)countDone / numberDates) * 100, 0);
			//    }
			//}

			return count;
		}

		public decimal GetSubjectCompleting(int subjectId, string user, Student student)
		{
			decimal count = 0;

			if (user == "S")
			{
				using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
				{
					var subject = repositoriesContainer.SubjectRepository.GetBy(
						new Query<Subject>(e => e.Id == subjectId)
						.Include(x => x.Labs));

					var labs = subject.Labs.ToList();
					var labsCount = labs.Count;

					var marks = repositoriesContainer.StudentsRepository
													.GetBy(new Query<Student>(e => e.Id == student.Id).Include(e => e.StudentLabMarks)).StudentLabMarks.Where(e => labs.Any(x => x.Id == e.LabId)).ToList().Count;//student.StudentLabMarks.Count;

					count = marks == 0 ? 0 : Math.Round(((decimal)marks / labsCount) * 100, 0);
				}
			}
			else
			{
				using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
				{
					var subject = repositoriesContainer.SubjectRepository.GetBy(
						new Query<Subject>(e => e.Id == subjectId).Include(
							x => x.SubjectGroups.Select(t => t.SubGroups.Select(c => c.ScheduleProtectionLabs))));

					var dates = new List<DateTime>();

					var isDate = false;

					foreach (var subjectGroup in subject.SubjectGroups)
					{
						foreach (var subGroup in subjectGroup.SubGroups)
						{
							if (subGroup.ScheduleProtectionLabs != null)
							{
								foreach (var scheduleProtectionLabs in subGroup.ScheduleProtectionLabs)
								{
									isDate = true;
									dates.Add(scheduleProtectionLabs.Date);
								}
							}
						}
					}

					if (isDate)
					{
						var numberDates = dates.Count;
						dates.Sort((a, b) => a.CompareTo(b));
						var nowDate = DateTime.Now.Date;

						var countDone = 0;

						foreach (var dateTime in dates)
						{
							if (nowDate > dateTime)
							{
								countDone += 1;
							}
						}

						count = Math.Round(((decimal)countDone / numberDates) * 100, 0);
					}
				}
			}

			

			return count;
		}

		public IList<Labs> GetSubjectLabs(int subjectId)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			return repositoriesContainer.LabsRepository.GetAll(new Query<Labs>(x => x.SubjectId == subjectId))
				.OrderBy(x => x.Order)
				.ToList();

		}


		public IList<Lectures> GetSubjectLectures(int subjectId)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			return repositoriesContainer.LecturesRepository.GetAll(new Query<Lectures>(x => x.SubjectId == subjectId))
				.OrderBy(x => x.Order)
				.ToList();
		}

        public Lecturer GetSubjectOwner(int subjectId)
        {
			try
            {
				using var repositoriesContainer = new LmPlatformRepositoriesContainer();

				var subjectLecturers = repositoriesContainer.RepositoryFor<SubjectLecturer>().GetAll(new Query<SubjectLecturer>
					(x => x.SubjectId == subjectId)).ToList();
				var owner = subjectLecturers.FirstOrDefault(x => x.Owner.HasValue);
				var subjectLecturerId = owner == null ? subjectLecturers.FirstOrDefault(x => !x.Owner.HasValue)?.LecturerId : owner.Owner;
				return repositoriesContainer.RepositoryFor<Lecturer>().GetBy(new Query<Lecturer>(x => x.Id == subjectLecturerId).Include(x => x.User));
			} catch
            {
				return null;
            }
		}

        public SubjectGroup GetSubjectGroup(IQuery<SubjectGroup> query)
        {
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();

			return repositoriesContainer.RepositoryFor<SubjectGroup>().GetBy(query);

		}

        public IEnumerable<SubjectGroup> GetSubjectGroups(IQuery<SubjectGroup> query)
		{
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();

			return repositoriesContainer.RepositoryFor<SubjectGroup>().GetAll(query).ToList();

		}

        public List<Subject> GetSubjects(IQuery<Subject> query)
        {
			using var repositoriesContainer = new LmPlatformRepositoriesContainer();
			return repositoriesContainer.SubjectRepository.GetAll(query).ToList();
		}

    }
}
