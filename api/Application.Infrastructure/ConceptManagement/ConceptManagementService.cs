using Application.Core;
using Application.Core.Data;
using Application.Core.PdfConvertor;
using Application.Infrastructure.FilesManagement;
using Application.Infrastructure.SubjectManagement;
using LMPlatform.Data.Repositories;
using LMPlatform.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Configuration;
using System.Diagnostics;
using Application.Infrastructure.KnowledgeTestsManagement;
using Application.Core.Helpers;
using System.Linq.Dynamic;

namespace Application.Infrastructure.ConceptManagement
{
    public class ConceptManagementService : IConceptManagementService
    {
        private const string TitlePageSectionName = "Титульный экран";
        private const string ProgramSectionName = "Программа курса";
        private const string LectSectionName = "Теоретический раздел";
        private const string PracticalSectionName = "Практический раздел";
        private const string TestSectionName = "Блок контроля знаний";



        private readonly string _storageRoot = ConfigurationManager.AppSettings["FileUploadPath"];
        private readonly string _storageRootTemp = ConfigurationManager.AppSettings["FileUploadPathTemp"];

        private readonly LazyDependency<ISubjectManagementService> subjectManagementService = new LazyDependency<ISubjectManagementService>();
        private readonly LazyDependency<IFilesManagementService> filesManagementService = new LazyDependency<IFilesManagementService>();
        private readonly LazyDependency<IModulesManagementService> _modulesManagementService = new LazyDependency<IModulesManagementService>();
        private readonly LazyDependency<ITestsManagementService> _testManagementService = new LazyDependency<ITestsManagementService>();

        public IFilesManagementService FilesManagementService => filesManagementService.Value;

        public ISubjectManagementService SubjectManagementService => subjectManagementService.Value;

        public IModulesManagementService ModulesManagementService => _modulesManagementService.Value;

        public ITestsManagementService TestsManagementService => _testManagementService.Value;

        public Concept AttachSiblings(int sourceId, int rightId, int leftId)
        {
            using var repositoriesContainer = new LmPlatformRepositoriesContainer();
            Func<int, Query<Concept>> queryById = id => new Query<Concept>(c => c.Id == id);
            var concept = repositoriesContainer.ConceptRepository.GetBy(queryById(sourceId));
            var right = repositoriesContainer.ConceptRepository.GetBy(queryById(rightId));
            var left = repositoriesContainer.ConceptRepository.GetBy(queryById(leftId));
            var currentPrevId = concept.PrevConcept.GetValueOrDefault();
            var currentNextId = concept.NextConcept.GetValueOrDefault();
            concept.NextConcept = rightId > 0 ? rightId : (int?)null;
            concept.PrevConcept = leftId > 0 ? leftId : (int?)null;
            repositoriesContainer.ConceptRepository.Save(concept);
            if (right != null)
            {
                right.PrevConcept = concept.Id;
                repositoriesContainer.ConceptRepository.Save(right);
            }
            if (left != null)
            {
                left.NextConcept = concept.Id;
                repositoriesContainer.ConceptRepository.Save(left);
            }
            var currentPrev = repositoriesContainer.ConceptRepository.GetBy(queryById(currentPrevId));
            var currentNext = repositoriesContainer.ConceptRepository.GetBy(queryById(currentNextId));

            if (currentPrev != null)
            {
                currentPrev.NextConcept = currentNext?.Id;
                repositoriesContainer.ConceptRepository.Save(currentPrev);
            }
            if (currentNext != null)
            {
                currentNext.PrevConcept = currentPrev?.Id;
                repositoriesContainer.ConceptRepository.Save(currentNext);
            }
            repositoriesContainer.ApplyChanges();

            return concept;
        }

        public Concept GetTreeConceptByElementId(int elementId)
        {
            using var repositoriesContainer = new LmPlatformRepositoriesContainer();
            var concept = GetLiteById(elementId);
            int id;
            if (!concept.ParentId.HasValue)
            {
                id = concept.Id;
            }
            else
            {
                FindRootId(concept, out id);
            }

            var res = repositoriesContainer.ConceptRepository.GetTreeConceptByElementId(elementId);

            return AttachTestModuleData(res);
        }

        private Concept AttachTestModuleData(Concept root)
        {
            if (root.SubjectId <= 0)
            {
                return root;
            }

            var allTests = TestsManagementService.GetTestsForSubject(root.SubjectId);
            var testData = allTests
                .Where(x => x.ForSelfStudy && x.CountOfQuestions > 0 && (x.Questions != null && x.Questions.Count > 0));
            var testModule = root.Children.FirstOrDefault(c => string.CompareOrdinal(c.Name, TestSectionName) == 0);
            if (testModule != null)
            {
                var tests = testData.Select(t => new Concept(t.Title, root.Author, root.Subject, false, true)
                {
                    ParentId = testModule.Id,
                    Test = t,
                    Id = t.Id,
                    Published = true
                }).ToList();
                tests.ForEach(t => testModule.Children.Add(t));
            }

            return root;
        }

        private void FindRootId(Concept concept, out int elementId)
        {
            var c = GetLiteById(concept.ParentId.GetValueOrDefault());
            if (!concept.ParentId.HasValue)
            {
                elementId = concept.Id;
                return;
            }

            FindRootId(c, out elementId);
        }

        public Concept GetById(int id)
        {
            using var repositoriesContainer = new LmPlatformRepositoriesContainer();
            var parent = repositoriesContainer.ConceptRepository.GetById(id);
            return parent;
        }

        public Concept GetLiteById(int id)
        {
            using var repositoriesContainer = new LmPlatformRepositoriesContainer();
            var query = new Query<Concept>(c => c.Id == id);
            var parent = repositoriesContainer.ConceptRepository.GetBy(query);
            return parent;
        }

        public IEnumerable<Concept> GetRootElements(int authorId, bool onlyVisible = false)
        {
            using var repositoriesContainer = new LmPlatformRepositoriesContainer();
            var rootElements = repositoriesContainer.ConceptRepository.GetRootElementsByAuthorId(authorId);
            return !onlyVisible
                ? rootElements
                : rootElements.Where(re =>
                    ModulesManagementService.GetModules(re.SubjectId)
                        .Any(m => m.ModuleType == ModuleType.ComplexMaterial));
        }

        public IEnumerable<Concept> GetRootElementsBySubject(int subjectId)
        {
            using var repositoriesContainer = new LmPlatformRepositoriesContainer();
            return repositoriesContainer.ConceptRepository.GetRootElementsBySubjectId(subjectId);
        }

        public IEnumerable<Concept> GetRootTreeElementsBySubject(int subjectId)
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                var roots = repositoriesContainer.ConceptRepository.GetRootElementsBySubjectId(subjectId);
                var res = new List<Concept>();
                foreach (var item in roots)
                    res.Add(GetTreeConceptByElementId(item.Id));
                return res;
            }
        }

        public IEnumerable<Concept> GetElementsBySubjectId(int subjectId)
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                return repositoriesContainer.ConceptRepository.GetBySubjectId(subjectId);
            }
        }

        public IEnumerable<Concept> GetElementsByParentId(int parentId)
        {
            using var repositoriesContainer = new LmPlatformRepositoriesContainer();
            var parent = GetById(parentId);
            if (IsTestModule(parent.Name))
            {
                if (parent.SubjectId <= 0)
                {
                    return Enumerable.Empty<Concept>();
                }

                var allTests = TestsManagementService.GetTestsForSubject(parent.SubjectId);
                return allTests
                    .Where(x => x.ForSelfStudy && x.CountOfQuestions > 0 && (x.Questions != null && x.Questions.Count > 0))
                    .Select(t => new Concept(t.Title, parent.Author, parent.Subject, false, true) 
                    { 
                        Id = t.Id, 
                        Container = "test", 
                        Test = t,
                        Published = true
                    });
            }

            return repositoriesContainer.ConceptRepository.GetByParentId(parentId);
        }

        public Concept GetByIdFixed(int id, bool withPrev = true, bool withNext = true)
        {
            var concept = GetLiteById(id);

            if (withPrev)
            {
                concept.PrevConcept = FindPrevReference(concept.Id);
            }

            if (withNext)
            {
                concept.NextConcept = FindNextReference(concept.Id);
            }

            return concept;
        }

        private int? FindNextReference(int conceptId, bool withoutTop = false)
        {
            Concept next = null;
            var concept = GetById(conceptId);
            if (!withoutTop && concept.Children != null && concept.Children.Count > 0)
            {
                next = concept.Children.ElementAt(0);
            }
            else if (concept.NextConcept != null)
            {
                next = GetById(concept.NextConcept.Value);
                withoutTop = false;
            }
            else if (concept.ParentId != null)
            {
                next = GetById(concept.ParentId.Value);
                withoutTop = true;
            }
            if (next == null)
            {
                return null;
            }

            return next.Container != null ? next.Id : FindNextReference(next.Id, withoutTop);
        }

        private int? FindPrevReference(int conceptId, bool withoutTop = false)
        {
            Concept next = null;
            var concept = GetById(conceptId);
            if (!withoutTop && concept.Children != null && concept.Children.Count > 0)
            {
                next = concept.Children.ElementAt(concept.Children.Count - 1);
            }
            else if (concept.PrevConcept != null)
            {
                next = GetById(concept.PrevConcept.Value);
                withoutTop = false;
            }
            else if (concept.ParentId != null)
            {
                next = GetById(concept.ParentId.Value);
                withoutTop = true;
            }
            if (next == null)
            {
                return null;
            }

            return next.Container != null ? next.Id : FindPrevReference(next.Id, withoutTop);
        }

        public IEnumerable<Concept> GetElementsByParentId(int parentId, int authorId)
        {
            return GetElementsByParentId(parentId).Where(c => c.UserId == authorId);
        }

        public Concept UpdateRootConcept(int id, string name, bool isPublished = true, bool includeLabs = true, bool includeLectures = true, bool includeTests = true, bool includeWorkshops = true)
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                var concept = repositoriesContainer.ConceptRepository.GetById(id);
                concept.Name = name;
                concept.Published = isPublished;
                repositoriesContainer.ConceptRepository.Save(concept);

                IEnumerable<Concept> tempConcepts = GetElementsByParentId(concept.Id).Where(c => c.ReadOnly == true);
                Boolean practialSectionPublished = includeLabs || includeWorkshops;
                foreach (Concept conceptChild in tempConcepts)
                {
                    switch (conceptChild.Name)
                    {
                        case LectSectionName:
                            if (conceptChild.Published != includeLectures)
                            {
                                conceptChild.Published = includeLectures;
                                repositoriesContainer.ConceptRepository.Save(conceptChild);
                            }
                            foreach (var item in conceptChild?.Children)
                            {
                                if (item.LectureId.HasValue)
                                {
                                    item.Published = includeLectures;
                                    repositoriesContainer.ConceptRepository.Save(item);
                                }
                            }
                            break;

                        case PracticalSectionName:
                            if (conceptChild.Published != practialSectionPublished)
                            {
                                conceptChild.Published = practialSectionPublished;
                                repositoriesContainer.ConceptRepository.Save(conceptChild);
                            }
                            foreach (var item in conceptChild?.Children)
                            {
                                if (item.LabId.HasValue)
                                {
                                    item.Published = includeLabs;
                                }
                                else
                                {
                                    item.Published = includeWorkshops;
                                }
                                repositoriesContainer.ConceptRepository.Save(item);
                            }
                            break;

                        case TestSectionName:
                            if (conceptChild.Published != includeTests)
                            {
                                conceptChild.Published = includeTests;
                                repositoriesContainer.ConceptRepository.Save(conceptChild);
                            }
                            break;
                    }
                }
                
                // Перестроить цепочку Next/Prev, пропуская неопубликованные разделы
                RebuildSectionsChain(tempConcepts, repositoriesContainer);
                
                repositoriesContainer.ApplyChanges();

                return concept;
            }
        }

        public Concept SaveConcept(Concept concept)
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                Concept lastSibling = null;
                if (concept.IsNew)
                {
                    lastSibling = GetLastSibling(concept.ParentId.GetValueOrDefault());
                    if (lastSibling != null)
                        concept.PrevConcept = lastSibling.Id;
                }

                if (concept.IsGroup)
                {
                    concept.Published = true;
                }

                repositoriesContainer.ConceptRepository.Save(concept);
                if (lastSibling != null)
                {
                    lastSibling.NextConcept = concept.Id;
                    repositoriesContainer.ConceptRepository.Save(lastSibling);
                }
                repositoriesContainer.ApplyChanges();
                return concept;
            }
        }

        private Concept GetLastSibling(int parentId)
        {
            return GetElementsByParentId(parentId).FirstOrDefault(i => i.NextConcept == null);
        }

        private void BindNeighborConcept(Concept concept, Concept sourceConcept, LmPlatformRepositoriesContainer repositoriesContainer)
        {
            if (concept.PrevConcept.HasValue)
            {
                var leftConcept = repositoriesContainer.ConceptRepository.GetById(concept.PrevConcept.Value);
                leftConcept.NextConcept = concept.Id;
                repositoriesContainer.ConceptRepository.Save(leftConcept);
                repositoriesContainer.ApplyChanges();
            }
            if (!concept.PrevConcept.HasValue && sourceConcept != null && sourceConcept.PrevConcept.HasValue)
            {
                var leftConcept = repositoriesContainer.ConceptRepository.GetById(sourceConcept.PrevConcept.Value);
                leftConcept.NextConcept = null;
                repositoriesContainer.ConceptRepository.Save(leftConcept);
                repositoriesContainer.ApplyChanges();
            }

            if (concept.NextConcept.HasValue)
            {
                var rightConcept = repositoriesContainer.ConceptRepository.GetById(concept.NextConcept.Value);
                rightConcept.PrevConcept = concept.Id;
                repositoriesContainer.ConceptRepository.Save(rightConcept);
                repositoriesContainer.ApplyChanges();
            }
            if (!concept.NextConcept.HasValue && sourceConcept != null && sourceConcept.NextConcept.HasValue)
            {
                var rightConcept = repositoriesContainer.ConceptRepository.GetById(sourceConcept.NextConcept.Value);
                rightConcept.PrevConcept = null;
                repositoriesContainer.ConceptRepository.Save(rightConcept);
                repositoriesContainer.ApplyChanges();
            }
        }

        public void ConvertPendingDocxToPdf(int conceptId)
        {
            var concept = GetById(conceptId);
            if (concept == null || string.IsNullOrEmpty(concept.Container))
                return;

            var attachments = FilesManagementService.GetAttachments(concept.Container);
            var docxFiles = attachments
                .Where(a => a.FileName.EndsWith(".docx", StringComparison.OrdinalIgnoreCase)
                         || a.FileName.EndsWith(".doc", StringComparison.OrdinalIgnoreCase)
                         || a.FileName.EndsWith(".rtf", StringComparison.OrdinalIgnoreCase))
                .ToList();

            if (!docxFiles.Any())
                return;

            var convertor = new WordToPdfConvertor();

            foreach (var attach in docxFiles)
            {
                var sourceFilePath = Path.Combine(
                    _storageRoot.TrimEnd('/', '\\'),
                    attach.PathName,
                    attach.FileName);

                if (!File.Exists(sourceFilePath))
                    continue;

                string convertedFileName;
                try
                {
                    var tempSourcePath = Path.Combine(_storageRootTemp.TrimEnd('/', '\\'), attach.FileName);
                    File.Copy(sourceFilePath, tempSourcePath, true);

                    convertedFileName = convertor.Convert(tempSourcePath);
                }
                catch
                {
                    continue;
                }

                var friendlyName = $"{Path.GetFileNameWithoutExtension(attach.Name)}.pdf";
                var newPathName = GetGuidFileName();

                var pdfAttachment = new Attachment
                {
                    AttachmentType = AttachmentType.Document,
                    Name = friendlyName,
                    PathName = newPathName,
                    FileName = convertedFileName,
                    UserId = attach.UserId,
                    CreationDate = DateTime.UtcNow
                };

                FilesManagementService.SaveFiles(new[] { pdfAttachment }, x => x.PathName);

                using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
                {
                    repositoriesContainer.AttachmentRepository.Save(pdfAttachment);
                    repositoriesContainer.ApplyChanges();
                }

                try
                {
                    var originalExt = (Path.GetExtension(attach.FileName) ?? string.Empty).ToLowerInvariant();
                    if (originalExt == ".docx" && File.Exists(sourceFilePath))
                    {
                        var newContainerDir = Path.Combine(_storageRoot.TrimEnd('/', '\\'), newPathName);
                        if (!Directory.Exists(newContainerDir))
                        {
                            Directory.CreateDirectory(newContainerDir);
                        }

                        var retainedSourcePath = Path.Combine(
                            newContainerDir,
                            Path.GetFileNameWithoutExtension(convertedFileName) + ".docx");
                        File.Copy(sourceFilePath, retainedSourcePath, true);
                    }
                }
                catch
                {
                }

                FilesManagementService.DeleteFileAttachment(attach);

                using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
                {
                    concept.Container = newPathName;
                    repositoriesContainer.ConceptRepository.Save(concept);
                    repositoriesContainer.ApplyChanges();
                }
            }
        }

        private IList<Attachment> ProcessWordAttachmentsIfExist(IList<Attachment> attachments, bool skipConversion = false)
        {
            var res = new List<Attachment>();
            if (attachments == null)
            {
                return res;
            }

            if (skipConversion)
            {
                return attachments.ToList();
            }

            var convertor = new WordToPdfConvertor();

            foreach (var attach in attachments)
            {
                var extension = Path.GetExtension(attach.Name);
                if (string.Compare(extension, ".doc", true) == 0 || string.Compare(extension, ".docx", true) == 0 || string.Compare(extension, ".rtf", true) == 0)
                {
                    var friendlyFileName = Path.GetFileNameWithoutExtension(attach.Name);
                    var sourceFilePath = string.Format("{0}{1}", _storageRootTemp, attach.FileName);
                    res.Add(new Attachment()
                    {
                        AttachmentType = AttachmentType.Document,
                        Id = 0,
                        Name = string.Format("{0}.pdf", friendlyFileName),
                        FileName = convertor.Convert(sourceFilePath)
                    });
                }
                else
                    res.Add(attach);

            }

            return res;
        }

        public Concept SaveConcept(Concept concept, IList<Attachment> attachments, bool containerExplicitlySet = false, bool preserveFiles = false, bool skipConversion = false)
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                attachments = ProcessWordAttachmentsIfExist(attachments, skipConversion);
                
                if (attachments != null && attachments.Count > 5)
                {
                    throw new InvalidOperationException("Максимальное количество файлов - 5");
                }
                
                if (!string.IsNullOrEmpty(concept.Container))
                {
                    if (!containerExplicitlySet && (attachments == null || !attachments.Any()))
                    {
                        if (!preserveFiles)
                        {
                            var existingFiles = repositoriesContainer.AttachmentRepository
                                .GetAll(new Query<Attachment>(e => e.PathName == concept.Container)).ToList();
                            foreach (var attachment in existingFiles)
                            {
                                FilesManagementService.DeleteFileAttachment(attachment);
                            }
                        }
                        concept.Container = null;
                    }
                    else if (!containerExplicitlySet)
                    {
                        var existingFiles = repositoriesContainer.AttachmentRepository
                            .GetAll(new Query<Attachment>(e => e.PathName == concept.Container)).ToList();
                        var attachmentIds = new HashSet<int>(attachments.Select(x => x.Id));
                        var deleteFiles = attachmentIds.Any()
                            ? existingFiles.Where(e => !attachmentIds.Contains(e.Id)).ToList()
                            : existingFiles;

                        foreach (var attachment in deleteFiles)
                        {
                            FilesManagementService.DeleteFileAttachment(attachment);
                        }
                    }
                }
                else if (attachments?.Any() == true)
                {
                    concept.Container = GetGuidFileName();
                }

                if (attachments?.Any() == true)
                {
                    var newAttachments = attachments.Where(e => e.Id == 0).ToList();
                    
                    if (newAttachments.Any())
                    {
                        FilesManagementService.SaveFiles(newAttachments, concept.Container);
                    }

                    foreach (var attachment in attachments)
                    {
                        if (attachment.Id == 0)
                        {
                            attachment.PathName = concept.Container;
                            attachment.UserId = concept.UserId;
                            attachment.CreationDate = DateTime.UtcNow;

                            repositoriesContainer.AttachmentRepository.Save(attachment);
                        }
                    }
                }
                concept.Published = true;

                Concept source = null;
                if (concept.Id != 0)
                    source = GetById(concept.Id);
                repositoriesContainer.ConceptRepository.Save(concept);
                repositoriesContainer.ApplyChanges();
                if (source == null)
                {
                    InitNeighborConcept(concept, repositoriesContainer);
                    repositoriesContainer.ConceptRepository.Save(concept);
                    repositoriesContainer.ApplyChanges();
                }
                BindNeighborConcept(concept, source, repositoriesContainer);

                if (concept.ParentId.HasValue)
                {
                    TryPublishParent(concept.ParentId, repositoriesContainer);
                }
                
                return concept;
            }
        }

        private void InitNeighborConcept(Concept concept, LmPlatformRepositoriesContainer repositoriesContainer)
        {
            var siblings = repositoriesContainer.ConceptRepository.GetByParentId(concept.ParentId.Value);
            var sibling = siblings.OrderByDescending(t => t.Id).FirstOrDefault(c => c.Id != concept.Id);
            if (sibling != null)
            {
                concept.PrevConcept = sibling.Id;
            }
        }

        private void TryPublishParent(int? parentId, LmPlatformRepositoriesContainer repoContainer)
        {
            if (parentId.HasValue)
            {
                var parent = repoContainer.ConceptRepository.GetBy(new Query<Concept>(c => c.Id == parentId.Value));
                if (parent != null && !parent.Published)
                {
                    parent.Published = true;
                    repoContainer.ConceptRepository.Save(parent);
                    repoContainer.ApplyChanges();
                    TryPublishParent(parent.ParentId, repoContainer);
                }
            }
        }

        private void AttachFolderToSection(string folderName, int userId, int subjectId, string sectionName)
        {
            using var repositoriesContainer = new LmPlatformRepositoriesContainer();
            var parent = repositoriesContainer.ConceptRepository.GetBy(
                new Query<Concept>()
                    .AddFilterClause(f => f.SubjectId == subjectId)
                    .AddFilterClause(f => f.UserId == userId)
                    .AddFilterClause(f => string.Compare(f.Name.Trim(), sectionName.Trim(), true) == 0)
                    .Include(c => c.Author)
                    .Include(c => c.Subject));

            var concept = new Concept(folderName, parent.Author, parent.Subject, true, false)
            {
                ParentId = parent.Id
            };
            repositoriesContainer.ConceptRepository.Save(concept);
        }

        public void AttachFolderToLectSection(string folderName, int userId, int subjectId)
        {
            AttachFolderToSection(folderName, userId, subjectId, LectSectionName);
        }

        public void AttachFolderToPracticalSection(string folderName, int userId, int subjectId)
        {
            AttachFolderToSection(folderName, userId, subjectId, PracticalSectionName);
        }

        private string GetGuidFileName()
        {
            return string.Format("P{0}", Guid.NewGuid().ToString("N").ToUpper());
        }

        public Concept CreateRootConcept(string name, int authorId, int subjectId, bool isPublished = false, bool includeLabs = false, bool includeLectures = false, bool includeTests = false, bool includeWorkshops = false)
        {
            using var repositoriesContainer = new LmPlatformRepositoriesContainer();
            var author = repositoriesContainer.UsersRepository.GetBy(new Query<User>().AddFilterClause(u => u.Id == authorId));
            var subject = repositoriesContainer.SubjectRepository.GetBy(new Query<Subject>().AddFilterClause(s => s.Id == subjectId));
            var concept = new Concept(name, author, subject, true, isPublished);

            var existingConcept = repositoriesContainer.ConceptRepository.GetBy(
                new Query<Concept>().AddFilterClause(c => c.Name == name).AddFilterClause(c => c.Subject.Id == subjectId)
            );

            if (existingConcept != null)
            {
                throw new Exception("Name already exist");
            }

            repositoriesContainer.ConceptRepository.Save(concept);
            repositoriesContainer.ApplyChanges();
            InitBaseChildrens(concept, repositoriesContainer, includeLabs, includeLectures, includeTests, includeWorkshops);
            return repositoriesContainer.ConceptRepository.GetBy(new Query<Concept>().AddFilterClause(c => c.Id == concept.Id));
        }

        private void RebuildSectionsChain(IEnumerable<Concept> sections, LmPlatformRepositoriesContainer repositoriesContainer)
        {
            // Определяем порядок разделов
            var orderedSections = new List<Concept>();
            var titlePage = sections.FirstOrDefault(x => x.Name == TitlePageSectionName);
            var program = sections.FirstOrDefault(x => x.Name == ProgramSectionName);
            var lectures = sections.FirstOrDefault(x => x.Name == LectSectionName);
            var practical = sections.FirstOrDefault(x => x.Name == PracticalSectionName);
            var tests = sections.FirstOrDefault(x => x.Name == TestSectionName);

            // Титульный экран и Программа курса всегда включены
            if (titlePage != null) orderedSections.Add(titlePage);
            if (program != null) orderedSections.Add(program);
            
            // Остальные разделы добавляем только если опубликованы
            if (lectures != null && lectures.Published) orderedSections.Add(lectures);
            if (practical != null && practical.Published) orderedSections.Add(practical);
            if (tests != null && tests.Published) orderedSections.Add(tests);

            // Сбрасываем все связи
            foreach (var section in sections)
            {
                section.PrevConcept = null;
                section.NextConcept = null;
                repositoriesContainer.ConceptRepository.Save(section);
            }

            // Строим новую цепочку только для опубликованных разделов
            for (int i = 0; i < orderedSections.Count; i++)
            {
                if (i > 0)
                {
                    orderedSections[i].PrevConcept = orderedSections[i - 1].Id;
                }
                if (i < orderedSections.Count - 1)
                {
                    orderedSections[i].NextConcept = orderedSections[i + 1].Id;
                }
                repositoriesContainer.ConceptRepository.Save(orderedSections[i]);
            }
        }

        private void InitBaseChildrens(Concept parent, LmPlatformRepositoriesContainer repositoriesContainer, bool includeLabs, bool includeLectures, bool includeTests, bool includeWorkshops)
        {
            var concept1 = new Concept(TitlePageSectionName, parent.Author, parent.Subject, false, true)
            {
                ParentId = parent.Id,
                ReadOnly = true
            };

            var concept2 = new Concept(ProgramSectionName, parent.Author, parent.Subject, false, true)
            {
                ParentId = parent.Id,
                ReadOnly = true
            };

            var concept3 = new Concept(LectSectionName, parent.Author, parent.Subject, true, includeLectures)
            {
                ParentId = parent.Id,
                ReadOnly = true
            };

            var concept4 = new Concept(PracticalSectionName, parent.Author, parent.Subject, true, includeLabs || includeWorkshops)
            {
                ParentId = parent.Id,
                ReadOnly = true
            };

            var concept5 = new Concept(TestSectionName, parent.Author, parent.Subject, true, includeTests)
            {
                ParentId = parent.Id,
                ReadOnly = true
            };

            var concepts = new[] { concept1, concept2, concept3, concept4, concept5 };
            repositoriesContainer.ConceptRepository.Save(concepts);
            repositoriesContainer.ApplyChanges();

            // Используем ту же логику для построения цепочки
            RebuildSectionsChain(concepts, repositoriesContainer);

            InitLectChild(concept3, repositoriesContainer, includeLectures);
            InitPracticalChild(concept4, repositoriesContainer, includeLabs, includeWorkshops);

            repositoriesContainer.ApplyChanges();
        }

        private void InitLectChild(Concept parent, LmPlatformRepositoriesContainer repositoriesContainer, bool includeLectures)
        {
            var sub = SubjectManagementService.GetSubject(new Query<Subject>(s => s.Id == parent.SubjectId)
                    .Include(s => s.Lectures));

            var lectures = sub.Lectures.OrderBy(s => s.Order).ToList();

            if (lectures.Count == 0)
                return;

            var conceptsToSave = new List<Concept>(lectures.Count);
            var fileInitActions = new List<Action>(lectures.Count);

            foreach (var item in lectures)
            {
                var concept = new Concept(item.Theme, parent.Author, parent.Subject, true, includeLectures)
                {
                    ParentId = parent.Id,
                    LectureId = item.Id
                };
                conceptsToSave.Add(concept);
                var lectureId = item.Id;
                fileInitActions.Add(() => InitLectFiles(concept, lectureId, repositoriesContainer));
            }

            repositoriesContainer.ConceptRepository.Save(conceptsToSave);

            for (int i = 1; i < conceptsToSave.Count; i++)
            {
                conceptsToSave[i].PrevConcept = conceptsToSave[i - 1].Id;
                conceptsToSave[i - 1].NextConcept = conceptsToSave[i].Id;
            }

            repositoriesContainer.ConceptRepository.Save(conceptsToSave, e => true);

            foreach (var action in fileInitActions)
            {
                try
                {
                    action();
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"Concept file init failed: {ex.Message}");
                }
            }
        }

        private void InitLectFiles(Concept parent, int lectureId, LmPlatformRepositoriesContainer repositoriesContainer)
        {
            var lecturesFiles = from at in repositoriesContainer.AttachmentRepository.GetAll()
                                join lec in repositoriesContainer.LecturesRepository.GetAll()
                                       on at.PathName equals lec.Attachments
                                where lec.Id == lectureId
                                select at;
            if (lecturesFiles.Any())
            {
                AddConceptAttachements(lecturesFiles.AsEnumerable(), parent, repositoriesContainer);
            }

            var itemsToUpdate = repositoriesContainer.ConceptRepository
                .GetAll(new Query<Concept>(x => x.ParentId == parent.Id))
                .AsEnumerable()
                .Select(x =>
                {
                    x.LectureId = lectureId;
                    return x;
                });

            repositoriesContainer.ConceptRepository.Save(itemsToUpdate);
        }

        private void InitPracticalChild(Concept parent, LmPlatformRepositoriesContainer repositoriesContainer, bool includeLabs, bool includeWorkshops)
        {
            var sub = SubjectManagementService.GetSubject(new Query<Subject>(s => s.Id == parent.SubjectId)
                    .Include(e => e.SubjectModules.Select(x => x.Module))
                    .Include(s => s.Practicals)
                    .Include(s => s.Labs));
            var moduleTypes = sub.SubjectModules.Select(m => m.Module.ModuleType).ToHashSet();
            var hasPracticals = moduleTypes.Contains(ModuleType.Practical);
            var hasLabs = moduleTypes.Contains(ModuleType.Labs);

            if (!hasPracticals && !hasLabs)
                return;
            var conceptsToSave = new List<Concept>();
            var fileInitActions = new List<Action>();

            if (hasPracticals)
            {
                foreach (var item in sub.Practicals.OrderBy(s => s.Order))
                {
                    var concept = new Concept(item.Theme, parent.Author, parent.Subject, true, includeWorkshops)
                    {
                        ParentId = parent.Id,
                        PracticalId = item.Id
                    };
                    conceptsToSave.Add(concept);

                    var itemId = item.Id;
                    fileInitActions.Add(() => InitPractFiles(concept, itemId, repositoriesContainer));
                }
            }
            if (hasLabs)
            {
                foreach (var item in sub.Labs.OrderBy(s => s.Order))
                {
                    var concept = new Concept(item.Theme, parent.Author, parent.Subject, true, includeLabs)
                    {
                        ParentId = parent.Id,
                        LabId = item.Id
                    };
                    conceptsToSave.Add(concept);

                    var itemId = item.Id;
                    fileInitActions.Add(() => InitLabsFiles(concept, itemId, repositoriesContainer));
                }
            }
            if (conceptsToSave.Count == 0)
                return;

            repositoriesContainer.ConceptRepository.Save(conceptsToSave);
            repositoriesContainer.ConceptRepository.Save(conceptsToSave, e => true);
            foreach (var action in fileInitActions)
            {
                try
                {
                    action();
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"Concept file init failed: {ex.Message}");
                }
            }
        }

        private void InitLabsFiles(Concept parent, int labId, LmPlatformRepositoriesContainer repositoriesContainer)
        {
            var labsFiles = from at in repositoriesContainer.AttachmentRepository.GetAll()
                            join lab in repositoriesContainer.LabsRepository.GetAll()
                                   on at.PathName equals lab.Attachments
                            where lab.Id == labId
                            select at;

            if (labsFiles.Any())
            {
                AddConceptAttachements(labsFiles, parent, repositoriesContainer);
            }

            var itemsToUpdate = repositoriesContainer.ConceptRepository
                .GetAll(new Query<Concept>(x => x.ParentId == parent.Id))
                .AsEnumerable()
                .Select(x =>
                {
                    x.LabId = labId;
                    return x;
                });

            repositoriesContainer.ConceptRepository.Save(itemsToUpdate);
        }

        private void InitPractFiles(Concept parent, int practId, LmPlatformRepositoriesContainer repositoriesContainer)
        {
            var practFiles = from at in repositoriesContainer.AttachmentRepository.GetAll()
                             join pact in repositoriesContainer.PracticalRepository.GetAll()
                                    on at.PathName equals pact.Attachments
                             where pact.Id == practId
                             select at;

            if (practFiles.Any())
            {
                AddConceptAttachements(practFiles, parent, repositoriesContainer);
            }

            var itemsToUpdate = repositoriesContainer.ConceptRepository
                .GetAll(new Query<Concept>(x => x.ParentId == parent.Id))
                .AsEnumerable()
                .Select(x =>
                {
                    x.PracticalId = practId;
                    return x;
                });

            repositoriesContainer.ConceptRepository.Save(itemsToUpdate);
        }

        private void AddConceptAttachements(IEnumerable<Attachment> existedRecords, Concept parent, LmPlatformRepositoriesContainer currentRepContainer, bool skipConversion = false)
        {

            var existedRecordsList = existedRecords as List<Attachment> ?? existedRecords.ToList();

            var readableNonPdfFiles = new List<Attachment>();
            var pdfAttachements = new List<Attachment>();

            foreach (var record in existedRecordsList)
            {
                var fileName = record.FileName;
                if (fileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase))
                {
                    pdfAttachements.Add(record);
                }
                else if (fileName.EndsWith(".doc", StringComparison.OrdinalIgnoreCase)
                      || fileName.EndsWith(".docx", StringComparison.OrdinalIgnoreCase)
                      || fileName.EndsWith(".rtf", StringComparison.OrdinalIgnoreCase))
                {
                    if (skipConversion)
                        pdfAttachements.Add(record);
                    else
                        readableNonPdfFiles.Add(record);
                }
            }

            if (readableNonPdfFiles.Any())
            {
                var convertor = new WordToPdfConvertor();
                var itemsToAdd = new List<Attachment>(readableNonPdfFiles.Count);

                foreach (var file in readableNonPdfFiles)
                {
                    var friendlyFileName = Path.GetFileNameWithoutExtension(file.Name);
                    var sourceFilePath = $"{_storageRoot}{file.PathName}//{file.FileName}";

                    if (File.Exists(sourceFilePath))
                    {
                        var convertedFileName = convertor.Convert(sourceFilePath);
                        itemsToAdd.Add(new Attachment()
                        {
                            AttachmentType = AttachmentType.Document,
                            Name = $"{friendlyFileName}.pdf",
                            PathName = GetGuidFileName(),
                            FileName = convertedFileName,
                            UserId = UserContext.CurrentUserId,
                            CreationDate = DateTime.UtcNow
                        });
                    }
                }
                if (itemsToAdd.Any())
                {
                    currentRepContainer.AttachmentRepository.Save(itemsToAdd);
                    FilesManagementService.SaveFiles(itemsToAdd, x => x.PathName);
                    pdfAttachements.AddRange(itemsToAdd);
                }
            }

            var conceptsToSave = new List<Concept>(pdfAttachements.Count);
            Concept prev = null;

            foreach (var attachement in pdfAttachements)
            {
                var concept = new Concept(
                    Path.GetFileNameWithoutExtension(attachement.Name),
                    parent.Author,
                    parent.Subject,
                    false,
                    false)
                {
                    ParentId = parent.Id,
                    Container = attachement.PathName,
                    Published = true,
                };

                if (prev != null)
                {
                    concept.PrevConcept = prev.Id;
                    prev.NextConcept = concept.Id;
                }

                conceptsToSave.Add(concept);
                prev = concept;
            }



            if (conceptsToSave.Any())
            {
                currentRepContainer.ConceptRepository.Save(conceptsToSave);
            }
        }

        private void ResetSiblings(int? prevConcept, int? nextConcept, LmPlatformRepositoriesContainer repositoriesContainer)
        {
            if (prevConcept.HasValue)
            {
                var prevItem = GetById(prevConcept.Value);
                prevItem.NextConcept = nextConcept.HasValue ? nextConcept.Value : (int?)null;
                repositoriesContainer.ConceptRepository.Save(prevItem);
            }
            if (nextConcept.HasValue)
            {
                var nextItem = GetById(nextConcept.Value);
                nextItem.PrevConcept = prevConcept.HasValue ? prevConcept.Value : (int?)null;
                repositoriesContainer.ConceptRepository.Save(nextItem);
            }
            repositoriesContainer.ApplyChanges();
        }

        public Concept MoveConceptNode(int conceptId, int newParentId, int prevConceptId, int nextConceptId)
        {
            using var repositoriesContainer = new LmPlatformRepositoriesContainer();
            Func<int, Query<Concept>> queryById = id => new Query<Concept>(c => c.Id == id);

            var concept = repositoriesContainer.ConceptRepository.GetBy(queryById(conceptId));
            if (concept == null)
                return null;

            var mandatorySectionNames = new[] { TitlePageSectionName, ProgramSectionName, LectSectionName, PracticalSectionName, TestSectionName };
            if (concept.ReadOnly == true && mandatorySectionNames.Contains(concept.Name))
                throw new InvalidOperationException($"Cannot move read-only concept");

            var oldPrev = concept.PrevConcept;
            var oldNext = concept.NextConcept;

            concept.ParentId = newParentId;
            concept.PrevConcept = prevConceptId > 0 ? prevConceptId : (int?)null;
            concept.NextConcept = nextConceptId > 0 ? nextConceptId : (int?)null;
            repositoriesContainer.ConceptRepository.Save(concept);

            ResetSiblings(oldPrev, oldNext, repositoriesContainer);

            if (prevConceptId > 0)
            {
                var prevNode = repositoriesContainer.ConceptRepository.GetBy(queryById(prevConceptId));
                if (prevNode != null)
                {
                    prevNode.NextConcept = concept.Id;
                    repositoriesContainer.ConceptRepository.Save(prevNode);
                }
            }
            if (nextConceptId > 0)
            {
                var nextNode = repositoriesContainer.ConceptRepository.GetBy(queryById(nextConceptId));
                if (nextNode != null)
                {
                    nextNode.PrevConcept = concept.Id;
                    repositoriesContainer.ConceptRepository.Save(nextNode);
                }
            }
            repositoriesContainer.ApplyChanges();
            return repositoriesContainer.ConceptRepository.GetById(concept.Id);
        }

        public bool IsTestModule(string moduleName)
        {
            return string.Compare(TestSectionName, moduleName, StringComparison.OrdinalIgnoreCase) == 0;
        }

        public int? GetRootConceptId(int conceptId)
        {
            if (conceptId <= 0)
            {
                return null;
            }

            var concept = GetById(conceptId);
            while (concept != null && concept.ParentId.HasValue)
            {
                concept = GetById(concept.ParentId.Value);
            }

            return concept?.Id;
        }

        public bool IsConceptUnderRoot(int conceptId, int rootConceptId)
        {
            if (conceptId <= 0 || rootConceptId <= 0)
            {
                return false;
            }

            if (conceptId == rootConceptId)
            {
                return true;
            }

            var rootId = GetRootConceptId(conceptId);
            return rootId.HasValue && rootId.Value == rootConceptId;
        }

        public void Remove(int id, bool removeChildren)
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                var item = GetById(id);
                var prev = item.PrevConcept;
                var next = item.NextConcept;
                var parentId = item.ParentId;
                repositoriesContainer.ConceptRepository.Remove(id, removeChildren);
                repositoriesContainer.ApplyChanges();
                ResetSiblings(prev, next, repositoriesContainer);
                TryPublishParent(parentId, repositoriesContainer);
            }
        }
    }
}
