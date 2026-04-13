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
using Application.Infrastructure.WatchingTimeManagement;
using Application.Infrastructure.StudentManagement;
using Application.Infrastructure.DTO;
using LMPlatform.Models;
using LMPlatform.UI.Services.Modules;
using LMPlatform.UI.Attributes;
using LMPlatform.UI.ViewModels.ComplexMaterialsViewModel;
using Newtonsoft.Json;
using LMPlatform.UI.Services.Modules.CoreModels;
using Org.BouncyCastle.Asn1.X509;
using LMPlatform.Data.Repositories;
using LMPlatform.Data.Infrastructure;

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
        private readonly LazyDependency<IModulesManagementService> _modulesManagementService = new LazyDependency<IModulesManagementService>();

        public IConceptManagementService ConceptManagementService => _conceptManagementService.Value;
        public IStudentManagementService StudentManagementService => _studentManagementService.Value;
        public IWatchingTimeService WatchingTimeService => _watchingTimeService.Value;
        public IUsersManagementService UsersManagementService => _usersManagementService.Value;
        public IFilesManagementService FilesManagementService => _filesManagementService.Value;
        public ISubjectManagementService SubjectManagementService => _subjectManagementService.Value;

        public IModulesManagementService ModulesManagementService => _modulesManagementService.Value;

        #region Used by complex module
        
        public ConceptResult SaveRootConcept(string name, string container, int subjectId, bool includeLabs, bool includeLectures, bool includeTests, bool includeWorkshops, bool isPublished)
        {
            try
            {
                //var authorId = UserContext.CurrentUserId;
                var root = ConceptManagementService.CreateRootConcept(name, 2, subjectId, isPublished, includeLabs, includeLectures, includeTests, includeWorkshops);
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
                var concepts = CurrentUserIsLector() ?
                    ConceptManagementService.GetRootElementsBySubject(subjectId) :
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
                var canDelete = source != null;
                if (canDelete)
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

        public ConceptResult EditRootConcept(int elementId, string name, bool? includeLabs, bool? includeLectures, bool? includeTests, bool? includeWorkshops, bool isPublished)
        {
            try
            {

                ConceptManagementService.UpdateRootConcept(elementId, name, isPublished, includeLabs ?? false, includeLectures ?? false, includeTests ?? false, includeWorkshops ?? false);

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
            var conceptViewData = new ConceptViewData(ConceptManagementService.GetTreeConceptByElementId(parenttId), true, FilesManagementService, true, CurrentUserIsLector());
            PopulateFilePath(conceptViewData);

            var res = new ConceptResult
            {
                Concept = conceptViewData,
                Message = SuccessMessage,
                Code = SuccessCode
            };
            return res;
        }

        public ConceptResult AddOrEditConcept(int conceptId, string conceptName, int parentId, bool isGroup, string fileData, int userId, string container = null)
        {
            try
            {
                var conceptModel = new AddOrEditConceptViewModel(userId, conceptId, parentId)
                {
                    IsGroup = isGroup,
                    Name = conceptName,
                    FileData = fileData
                };

                if (!string.IsNullOrEmpty(container))
                {
                    conceptModel.Container = container;
                }

                if (!string.IsNullOrEmpty(conceptModel.FileData))
                {
                    var attachmentsModel = JsonConvert.DeserializeObject<List<Attachment>>(conceptModel.FileData).ToList();
                    conceptModel.SetAttachments(attachmentsModel);
                }

                conceptModel.Save();

                return new ConceptResult
                {
                    SavedConceptId = conceptModel.SavedConcept?.Id,
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

        public string[] GetFolderFilesPaths(int conceptId)
        {
            var tree = GetConceptTreeCascade(conceptId);

            return tree.Select(x => GetFilePath(x.Container)).ToArray();
        }

        public void SaveMonitoringResult(int userId, int conceptId, int timeInSeconds)
        {
            WatchingTimeService.SaveWatchingTime(new WatchingTime(userId, conceptId, timeInSeconds));
        }

        private string GetFilePath(string container)
        {
            var attach = FilesManagementService.GetAttachments(container).FirstOrDefault();
            if (attach == null) return string.Empty;
            return $"{attach.PathName}//{ attach.FileName}";
        }

        private IEnumerable<Models.Concept> GetConceptTreeCascade(int conceptId)
        {
            var tree = ConceptManagementService.GetElementsByParentId(conceptId); ;

            foreach (var childFolder in tree.Where(x => x.IsGroup))
            {
                tree.Union(GetConceptTreeCascade(childFolder.Id));
            }

            return tree;
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
                return new ConceptViewData(tree, true, true, CurrentUserIsLector());
            }
            catch
            {
                return null;
            }
        }

        public ConceptStudentMonitoringData GetStudentMonitoringInfo(int complexId, int studentId)
        {
            try
            {
                var student = StudentManagementService.GetStudent(studentId);
                var rootConcept = ConceptManagementService.GetTreeConceptByElementId(complexId);


                return new ConceptStudentMonitoringData()
                {
                    ComplexName = rootConcept.Name,
                    StudentGroup = student.Group.Name,
                    StudentName = student.FullName,
                    ConceptMonitorings = GetMonitoringInfo(rootConcept, studentId)
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        private List<ConceptMonitoring> GetMonitoringInfo(Models.Concept rootConcept, int studentId)
        {
            var resultList = new List<ConceptMonitoring>();

            if (rootConcept.Children == null || !rootConcept.Children.Any())
            {
                return resultList;
            }

            var sortedChildren = rootConcept.Children.Select(c => new ConceptViewData(c)).ToList().SortDoubleLinkedList();
            var conceptDict = rootConcept.Children.ToDictionary(c => c.Id);

            foreach (var childViewData in sortedChildren)
            {
                if (!conceptDict.ContainsKey(childViewData.Id))
                    continue;

                var children = conceptDict[childViewData.Id];

                if (!children.Published)
                {
                    continue;
                }

                var resultItem = ConceptMonitoring.FromConcept(children);
                resultItem.Id = children.Id;

                if (children.Children?.Any() == true)
                {
                    resultItem.Children = GetMonitoringInfo(children, studentId);
                }

                if (children.Container != null)
                {
                    int estimated = WatchingTimeService.GetEstimatedTime(children.Container);

                    if (estimated > 0)
                    {
                        resultItem.Estimated = estimated;
                    }

                    resultItem.WatchingTime = WatchingTimeService.GetByConceptSubject(children.Id, studentId)?.Time;
                }

                resultList.Add(resultItem);
            }

            return resultList;
        }

        public ConceptViewData GetConceptTreeMobile(int elementId)
		{
			try
			{
				var tree = ConceptManagementService.GetTreeConceptByElementId(elementId);
                var dataTree = new ConceptViewData(tree, true, true, CurrentUserIsLector());
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
        public StudentsResult GetConfirmedAndNoneDeletedStudentsByGroupId(int groupId)
        {
            try
            {
                var students = StudentManagementService.GetConfirmedAndNoneDeletedStudentsByGroup(groupId);

                return new StudentsResult
                {
                    Students = students.Select(e => new StudentsViewData
                    {
                        StudentId = e.Id,
                        FullName = e.FullName
                    }).ToList(),
                };
            }
            catch (Exception ex)
            {
                return new StudentsResult
                {
                    Message = ex.Message + "\n" + ex.StackTrace,
                    Code = "500"
                };
            }
        }
        public MonitoringData GetConceptViews(int conceptId, int groupId)
        {
            var concept = ConceptManagementService.GetLiteById(conceptId);
            var list = WatchingTimeService.GetAllRecords(conceptId);
            var viewRecords = new List<ViewsWorm>();
            var students = StudentManagementService.GetConfirmedAndNoneDeletedStudentsByGroup(groupId);
            int time;
            foreach (var student in students)
            {
                time = 0;
                foreach (var item in list)
                {
                    if (student.Id == item.UserId)
                    {
                        time = item.Time;
                        break;
                    }
                }

                viewRecords.Add(new ViewsWorm
                {
                    Name = student.FullName,
                    Seconds = time
                });
            }
            var views = viewRecords.OrderBy(x => x.Name).ToList();
            var estimated = WatchingTimeService.GetEstimatedTime(concept.Container);
            return new MonitoringData
            {
                Views = views,
                Estimated = estimated
            };
        }
        public class MonitoringData
        {
            public List<ViewsWorm> Views { get; set; }
            public int Estimated { get; set; }
        }
        // Данные для страницы мониторинга для одного студента
        public class ConceptStudentMonitoringData
        {
            public List<ConceptMonitoring> ConceptMonitorings { get; set; }
            public string StudentName { get; set; }
            public string StudentGroup { get; set; }
            public string ComplexName { get; set; }
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

        public ConceptAvailableModules GetAvailableModules(int subjectId) 
        {
            var modules = ModulesManagementService.GetModules(subjectId).Select(module => module.ModuleType).ToList();

            var availableModules = new ConceptAvailableModules()
            {
                Lectures = modules.Contains(ModuleType.Lectures),
                Workshops = modules.Contains(ModuleType.Practical),
                Labs = modules.Contains(ModuleType.Labs),
                Tests = modules.Contains(ModuleType.SmartTest)
            };

            return availableModules;
        }

        public ResultViewData HideTest(int conceptId, int? testId, int complexId)
        {
            try
            {
                using (var context = new LMPlatform.Data.Infrastructure.LmPlatformModelsContext())
                {
                    var existing = context.HiddenTests
                        .FirstOrDefault(ht => ht.ConceptId == conceptId && ht.ComplexId == complexId);

                    if (existing == null)
                    {
                        var hiddenTest = new HiddenTest
                        {
                            ConceptId = conceptId,
                            TestId = testId,
                            ComplexId = complexId
                        };
                        context.HiddenTests.Add(hiddenTest);
                    }
                    else
                    {
                        if (existing.TestId != testId)
                        {
                            existing.TestId = testId;
                        }
                    }

                    context.SaveChanges();
                }

                return new ResultViewData
                {
                    Message = SuccessMessage,
                    Code = SuccessCode
                };
            }
            catch (Exception ex)
            {
                var innerException = ex.InnerException != null ? ex.InnerException.Message : string.Empty;
                var stackTrace = ex.StackTrace != null ? ex.StackTrace.Substring(0, Math.Min(200, ex.StackTrace.Length)) : string.Empty;
                return new ResultViewData
                {
                    Message = $"HideTest Error: conceptId={conceptId}, testId={testId}, complexId={complexId}, error={ex.Message}, inner={innerException}, stack={stackTrace}",
                    Code = ServerErrorCode
                };
            }
        }

        public HiddenTestsResult GetHiddenTests(int complexId)
        {
            try
            {
                using (var repositoriesContainer = new LMPlatform.Data.Repositories.LmPlatformRepositoriesContainer())
                {
                    var hiddenTests = repositoriesContainer.HiddenTestRepository
                        .GetAll(new Application.Core.Data.Query<HiddenTest>(ht => ht.ComplexId == complexId))
                        .ToList();

                    return new HiddenTestsResult
                    {
                        ConceptIds = hiddenTests.Select(ht => ht.ConceptId).Distinct().ToList(),
                        TestIds = hiddenTests.Where(ht => ht.TestId.HasValue).Select(ht => ht.TestId.Value).Distinct().ToList(),
                        Message = SuccessMessage,
                        Code = SuccessCode
                    };
                }
            }
            catch (Exception ex)
            {
                return new HiddenTestsResult
                {
                    ConceptIds = new List<int>(),
                    TestIds = new List<int>(),
                    Message = "Ошибка при получении скрытых тестов: " + ex.Message,
                    Code = ServerErrorCode
                };
            }
        }
	}
}
