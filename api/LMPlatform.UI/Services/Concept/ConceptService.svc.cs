using Application.Core;
using Application.Infrastructure.ConceptManagement;
using Application.Infrastructure.FilesManagement;
using Application.Infrastructure.SubjectManagement;
using Application.Infrastructure.UserManagement;
using LMPlatform.UI.Services.Modules.Concept;
using System;
using System.Collections.Generic;
using System.Linq;
using Application.Core.Data;
using WebMatrix.WebData;
using Application.Infrastructure.WatchingTimeManagement;
using Application.Infrastructure.StudentManagement;
using LMPlatform.Models;
using LMPlatform.UI.Services.Modules;
using System.Configuration;
using Application.Core.Helpers;
using LMPlatform.UI.Attributes;
using LMPlatform.UI.ViewModels.ComplexMaterialsViewModel;
using Newtonsoft.Json;

namespace LMPlatform.UI.Services.Concept
{
    [JwtAuth]
    public class ConceptService : IConceptService
    {
        private const string SuccessCode = "200";
        private const string ServerErrorCode = "500";
        private const string SuccessMessage = "Операция выполнена успешно";

        private readonly LazyDependency<IStudentManagementService> _studentManagementService = new LazyDependency<IStudentManagementService>();
        private readonly LazyDependency<IConceptManagementService> _conceptManagementService = new LazyDependency<IConceptManagementService>();
        private readonly LazyDependency<ISubjectManagementService> _subjectManagementService = new LazyDependency<ISubjectManagementService>();
        private readonly LazyDependency<IWatchingTimeService> _watchingTimeService = new LazyDependency<IWatchingTimeService>();
        private readonly LazyDependency<IUsersManagementService> _usersManagementService = new LazyDependency<IUsersManagementService>();
        private readonly LazyDependency<IFilesManagementService> _filesManagementService = new LazyDependency<IFilesManagementService>();


        public IConceptManagementService ConceptManagementService => _conceptManagementService.Value;
        public IStudentManagementService StudentManagementService => _studentManagementService.Value;
        public IWatchingTimeService WatchingTimeService => _watchingTimeService.Value;
        public IUsersManagementService UsersManagementService => _usersManagementService.Value;
        public IFilesManagementService FilesManagementService => _filesManagementService.Value;
        public ISubjectManagementService SubjectManagementService => _subjectManagementService.Value;

        #region Used by complex module
        
        public ConceptResult SaveRootConcept(string name, string container, int subjectId, bool includeLabs, bool includeLectures, bool includeTests)
        {
            try
            {
                //var authorId = UserContext.CurrentUserId;
                var root = ConceptManagementService.CreateRootConcept(name, 2, subjectId, includeLabs, includeLectures, includeTests);
                var subj = SubjectManagementService.GetSubject(new Query<Subject>(s => s.Id == subjectId));
                return new ConceptResult
                {
                    Concept = new ConceptViewData(root),
                    Message = SuccessMessage,
                    SubjectName = subj.Name,
                    Code = SuccessCode
                };
            }
            catch (Exception ex)
            {
                return new ConceptResult
                {
                    Message = ex.Message,
                    Code = ServerErrorCode
                };
            }
        }

        public ConceptResult GetRootConcepts(int subjectId)
        {
            try
            {
                //var authorId = UserContext.CurrentUserId;
                //var concepts = CurrentUserIsLector()  ?
                //    ConceptManagementService.GetRootElements(authorId) :
                //    ConceptManagementService.GetRootElementsBySubject(subjectId).Where(c => c.Published);

                var concepts = ConceptManagementService.GetRootElementsBySubject(subjectId);//.Where(c => c.Published);
                concepts = concepts.Where(c => c.SubjectId == subjectId);
                var subj = SubjectManagementService.GetSubject(new Query<Subject>(s => s.Id == subjectId));

                return new ConceptResult
                {
                    Concepts = concepts.Select(c => new ConceptViewData(c)).ToList(),
                    Message = SuccessMessage,
                    SubjectName = subj.Name,
                    Code = SuccessCode
                };
            }
            catch (Exception ex)
            {

                return new ConceptResult
                {
                    Message = ex.Message,
                    Code = ServerErrorCode
                };
            }
        }

        public ConceptResult GetConcepts(int parentId)
        {
            try
            {
                //var authorId = UserContext.CurrentUserId;
                var concepts = ConceptManagementService.GetElementsByParentId(parentId);
                var concept = ConceptManagementService.GetById(parentId);

                return new ConceptResult
                {
                    Concepts = concepts.Select(c => new ConceptViewData(c)).ToList().SortDoubleLinkedList(),
                    Concept = new ConceptViewData(concept),
                    SubjectName = concept.Subject.Name,
                    Message = SuccessMessage,
                    Code = SuccessCode
                };
            }
            catch (Exception ex)
            {

                return new ConceptResult
                {
                    Message = ex.Message,
                    Code = ServerErrorCode
                };
            }
        }

        public ConceptResult Remove(int conceptId)
        {
            try
            {
                var source = ConceptManagementService.GetById(conceptId);
                var canDelete = source != null && source.Author.Id == UserContext.CurrentUserId;
                if (canDelete || true)
                {
                    ConceptManagementService.Remove(conceptId, source.IsGroup);
                }

                return new ConceptResult
                {
                    Message = SuccessMessage,
                    Code = SuccessCode,
                    SubjectName = source.Subject.Name
                };
            }
            catch (Exception ex)
            {
                return new ConceptResult
                {
                    Message = ex.Message,
                    Code = ServerErrorCode
                };
            }
        }

        public ConceptResult EditRootConcept(int elementId, string name, bool isPublished)
        {
            try
            {
                ConceptManagementService.UpdateRootConcept(elementId, name, isPublished);

                return new ConceptResult
                {
                    Message = SuccessMessage,
                    Code = SuccessCode
                };
            }
            catch (Exception ex)
            {

                return new ConceptResult
                {
                    Message = ex.Message,
                    Code = ServerErrorCode
                };
            }
        }

        public ConceptResult GetConceptCascade(int parenttId)
        {
            var conceptViewData = new ConceptViewData(ConceptManagementService.GetTreeConceptByElementId(parenttId), true, FilesManagementService);
            PopulateFilePath(conceptViewData);

            var res = new ConceptResult
            {
                Concept = conceptViewData,
                Message = SuccessMessage,
                Code = SuccessCode
            };
            return res;
        }

        public ConceptResult AddOrEditConcept(int conceptId, string conceptName, int parentId, bool isGroup, string fileData, int userId)
        {
            try
            {
                var conceptModel = new AddOrEditConceptViewModel(userId, conceptId, parentId)
                {
                    IsGroup = isGroup,
                    Name = conceptName,
                    FileData = fileData
                };

                if (!conceptModel.IsGroup && !string.IsNullOrEmpty(conceptModel.FileData))
                {
                    var attachmentsModel = JsonConvert.DeserializeObject<List<Attachment>>(conceptModel.FileData).ToList();
                    conceptModel.SetAttachments(attachmentsModel);
                }

                conceptModel.Save();

                return new ConceptResult
                {
                    Message = SuccessCode,
                    Code = SuccessCode
                };
            }
            catch (Exception ex)
            {
                return new ConceptResult
                {
                    Message = ex.Message,
                    Code = ServerErrorCode
                };
            }
        }

        private void PopulateFilePath(ConceptViewData children)
        {
            if (children.Children != null && children.Children.Any())
            {
                foreach (var data in children.Children)
                {
                    PopulateFilePath(data);
                }
            }

            if (!children.HasData) return;
            var attach = FilesManagementService.GetAttachments(children.Container).FirstOrDefault();
            if (attach == null) return;
            children.FilePath = $"{attach.PathName}//{ attach.FileName}";
        }
		
        #endregion

		#region Used By Mobile
		public ConceptResult AttachSiblings(int source, int left, int right)
        {
            try
            {
                var concept = ConceptManagementService.AttachSiblings(source, right, left);

                return new ConceptResult
                {
                    Concept = new ConceptViewData(concept),
                    Message = SuccessMessage,
                    Code = SuccessCode,
                    SubjectName = concept.Subject.Name
                };
            }
            catch (Exception ex)
            {
                
                return new ConceptResult
                {
                    Message = ex.Message,
                    Code = ServerErrorCode
                };
            }
        }       
		public ConceptResult GetRootConceptsMobile(int subjectId, int userId, string identityKey)
		{
			try
			{
				if (identityKey != "7e13f363-2f00-497e-828e-49e82d8b4223")
				{
					throw new UnauthorizedAccessException();
				}
                var user = UsersManagementService.GetUser(userId);
                var concepts = user.Lecturer != null ?
					ConceptManagementService.GetRootElements(userId) : 
					ConceptManagementService.GetRootElementsBySubject(subjectId).Where(c => c.Published);
                concepts = concepts.Where(c => c.SubjectId == subjectId);
				var subj = SubjectManagementService.GetSubject(new Query<Subject>(s => s.Id == subjectId));
                
				return new ConceptResult
				{
					Concepts = concepts.Select(c => new ConceptViewData(c)).ToList(),
					Message = SuccessMessage,
					SubjectName = subj.Name,
					Code = SuccessCode
				};
			}
			catch (Exception ex)
			{
				return new ConceptResult
				{
					Message = ex.Message,
					Code = ServerErrorCode
				};
			}
		}
        public ConceptViewData GetConceptTree(int elementId)
        {
            try
            {
                var tree = ConceptManagementService.GetTreeConceptByElementId(elementId);
                return new ConceptViewData(tree, true);
            }
            catch
            {
                return null;
            }
        }
		public ConceptViewData GetConceptTreeMobile(int elementId)
		{
			try
			{
				var tree = ConceptManagementService.GetTreeConceptByElementId(elementId);
                var dataTree = new ConceptViewData(tree, true);
                PopulateFilePath(dataTree);
                return dataTree;
			}
			catch
			{
				return null;
			}
		}
		public AttachViewData GetNextConceptData(int elementId)
        {
            var concept = ConceptManagementService.GetByIdFixed(elementId, withPrev:false);
            return GetNeighborConceptData(concept.NextConcept.GetValueOrDefault());
        }
        public AttachViewData GetPrevConceptData(int elementId)
        {
            var concept = ConceptManagementService.GetByIdFixed(elementId, withNext:false);
            return GetNeighborConceptData(concept.PrevConcept.GetValueOrDefault());
        }
        public MonitoringData GetConceptViews(int conceptId, int groupId)
        {
            var concept = ConceptManagementService.GetLiteById(conceptId);
            var list = WatchingTimeService.GetAllRecords(conceptId);
            var viewRecords = new List<ViewsWorm>();
            var studentIds = list.Select(i => i.UserId);
            var students =
	            StudentManagementService.GetStudents(new Query<Student>(s => studentIds.Any(id => id == s.Id)));

            foreach (var item in list)
            {
                var student = students.Single(s => s.Id == item.UserId);
                if (student == null || student.GroupId != groupId) continue;
                viewRecords.Add(new ViewsWorm
                {
	                Name = student.FullName, Seconds = item.Time
                });
            }
            var views = viewRecords.OrderBy(x => x.Name).ToList();
            var estimated = WatchingTimeService.GetEstimatedTime(concept.Container);
            return new MonitoringData
            {
	            Views = views, Estimated = estimated
            };
        }
        public class MonitoringData
        {
            public List<ViewsWorm> Views { get; set; }
            public int Estimated { get; set; }
        }
        public class ViewsWorm
        {
            public string Name { get; set; }
            public int Seconds { get; set; }
        }
        public ConceptViewData GetConcept(int elementId)
        {
            var concept =  ConceptManagementService.GetById(elementId);
            return new ConceptViewData(concept);
        }
        public ConceptPageTitleData GetConceptTitleInfo(int subjectId)
        {
	        var query = new Query<Subject>(e => e.Id == subjectId)
		        .Include(e => e.SubjectLecturers.Select(x => x.Lecturer.User));
            var subject = SubjectManagementService.GetSubject(query);
	        var lecturer = subject.SubjectLecturers.FirstOrDefault().Lecturer;
            return new ConceptPageTitleData
            {
                Lecturer = new LectorViewData(lecturer, true),
                Subject = new Modules.Parental.SubjectViewData(subject)
            };
        }
        private AttachViewData GetNeighborConceptData(int neighborId)
        {
            var neighbor = ConceptManagementService.GetLiteById(neighborId);
            if (neighbor == null)
            {
	            return new AttachViewData(0, string.Empty, null);
            }

            var att = FilesManagementService.GetAttachments(neighbor.Container).FirstOrDefault(); 
            return new AttachViewData(neighbor.Id, neighbor.Name, att);
        }
        private bool CurrentUserIsLector()
        {
	        return UsersManagementService.CurrentUser.Membership.Roles.Any(r => r.RoleName.Equals("lector"));
        }
		#endregion 
	}
}
