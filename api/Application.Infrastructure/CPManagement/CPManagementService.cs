using Application.Core;
using Application.Core.Data;
using Application.Infrastructure.CTO;
using LMPlatform.Data.Infrastructure;
using System;
using System.Data.Entity;
using System.Linq;
using Application.Core.Extensions;
using LMPlatform.Models.CP;
using LMPlatform.Data.Repositories;
using LMPlatform.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Infrastructure.FilesManagement;
using Application.Infrastructure.ProjectManagement;
using Application.Infrastructure.Export;
using Application.Infrastructure.LecturerManagement;
using Application.Core.Helpers;
using System.Net.Http;
using DocumentFormat.OpenXml.Spreadsheet;

namespace Application.Infrastructure.CPManagement
{
    public class CPManagementService: ICPManagementService
    {
        private readonly LazyDependency<ILecturerManagementService> _lecturerManagementService;

        private readonly LazyDependency<IFilesManagementService> _filesManagementService;

        private readonly LazyDependency<IProjectManagementService> _projectManagementService;

        private readonly LazyDependency<ICpContext> _context;

        public ILecturerManagementService LecturerManagementService
            => _lecturerManagementService.Value;

        private ICpContext Context
            => _context.Value;

        private IFilesManagementService FilesManagementService
            => _filesManagementService.Value;
        
        private IProjectManagementService ProjectManagementService
            => _projectManagementService.Value;

        public CPManagementService()
        {
            _lecturerManagementService = new LazyDependency<ILecturerManagementService>();
            _filesManagementService = new LazyDependency<IFilesManagementService>();
            _projectManagementService = new LazyDependency<IProjectManagementService>();
            _context = new LazyDependency<ICpContext>();
        }

        public PagedList<CourseProjectData> GetProjects(int userId, GetPagedListParams parms)
        {
            var subjectId = int.Parse(parms.Filters["subjectId"]);
            var searchString = parms.Filters["searchString"];

            var query = Context.CourseProjects.AsNoTracking()
                .Include(x => x.Lecturer)
                .Include(x => x.AssignedCourseProjects.Select(asp => asp.Student.Group))
                .Include(x=>x.Subject);

            var user = Context.Users.Include(x => x.Student).Include(x => x.Lecturer).SingleOrDefault(x => x.Id == userId);

            if (user != null && user.Lecturer != null)
            {
                var joinedLecturerIds = LecturerManagementService.GetJoinedLector(subjectId)
                    .GroupBy(x => x.Id).Select(x => x.First().Id).ToList();

                    query = query.Where(x => x.SubjectId == subjectId && joinedLecturerIds.Any(id => id == x.LecturerId));
            }

            if (user != null && user.Student != null)
            {
                    query = query.Where(x => x.SubjectId == subjectId && x.CourseProjectGroups.Any(dpg => dpg.GroupId == user.Student.GroupId));
            }

            if (searchString.Length > 0)
            {
                var courseProjects = from cp in query
                                     let acp = cp.AssignedCourseProjects.FirstOrDefault()
                                     where acp.Student.LastName.Contains(searchString) || 
                                            cp.Theme.Contains(searchString) ||
                                            acp.Student.Group.Name.Contains(searchString)
                                     select new CourseProjectData
                                     {
                                         Id = cp.CourseProjectId,
                                         Theme = cp.Theme,
                                         Lecturer = cp.Lecturer != null ? cp.Lecturer.LastName + " " + cp.Lecturer.FirstName + " " + cp.Lecturer.MiddleName : null,
                                         Student = acp.Student != null ? acp.Student.LastName + " " + acp.Student.FirstName + " " + acp.Student.MiddleName : null,
                                         StudentId = acp.StudentId,
                                         Group = acp.Student.Group.Name,
                                         ApproveDate = acp.ApproveDate
                                     };

                return courseProjects.ApplyPaging(parms);
            }
            else
            {
                var courseProjects = from cp in query
                                     let acp = cp.AssignedCourseProjects.FirstOrDefault()
                                     select new CourseProjectData
                                     {
                                         Id = cp.CourseProjectId,
                                         Theme = cp.Theme,
                                         Lecturer = cp.Lecturer != null ? cp.Lecturer.LastName + " " + cp.Lecturer.FirstName + " " + cp.Lecturer.MiddleName : null,
                                         Student = acp.Student != null ? acp.Student.LastName + " " + acp.Student.FirstName + " " + acp.Student.MiddleName : null,
                                         StudentId = acp.StudentId,
                                         Group = acp.Student.Group.Name,
                                         ApproveDate = acp.ApproveDate
                                     };

                return courseProjects.ApplyPaging(parms);
            }   
        }

        public List<CourseProjectData> GetProjectsByUserId(int userId)
        {
            var query = Context.CourseProjects.AsNoTracking()
                .Include(x => x.Lecturer)
                .Include(x => x.AssignedCourseProjects.Select(asp => asp.Student.Group))
                .Include(x => x.Subject);

            var user = Context.Users.Include(x => x.Student).Include(x => x.Lecturer).SingleOrDefault(x => x.Id == userId);

            if(user != null)
            {
                if (user.Lecturer != null)
                {
                    query = query.Where(x => x.LecturerId == userId);
                }

                else
                {
                    query = query.Where(x => x.AssignedCourseProjects.Any(dpg => dpg.StudentId == user.Student.Id));
                }
            }
           
            var buf = from cp in query
                                     let acp = cp.AssignedCourseProjects.FirstOrDefault()
                                     select new CourseProjectData
                                     {
                                         Id = cp.CourseProjectId,
                                         Theme = cp.Theme,
                                         SubjectShortName = cp.Subject.ShortName,
                                         SubjectFullName = cp.Subject.Name
                                     };

            List<CourseProjectData> courseProjects = buf.ToList<CourseProjectData>();

            return courseProjects;
        }

        public CourseProjectData GetProject(int id)
        {
            var cp = Context.CourseProjects
                .AsNoTracking()
                .Include(x => x.CourseProjectGroups)
                .Single(x => x.CourseProjectId == id);

            return new CourseProjectData
            {
                Id = cp.CourseProjectId,
                Theme = cp.Theme,
                SelectedGroupsIds = cp.CourseProjectGroups.Select(x => x.GroupId)
            };
        }

        public void SaveProject(CourseProjectData projectData)
        {
            if (!projectData.LecturerId.HasValue)
            {
                throw new ApplicationException("LecturerId cant be empty!");
            }

            AuthorizationHelper.ValidateLecturerAccess(Context, projectData.LecturerId.Value);

            CourseProject project;

            if (projectData.Id.HasValue)
            {   
                project = Context.CourseProjects
                              .Include(x => x.CourseProjectGroups)
                              .Single(x => x.CourseProjectId == projectData.Id);

                if (Context.CourseProjects.Any(x => x.Theme == projectData.Theme && x.SubjectId == projectData.SubjectId && x.CourseProjectId != projectData.Id))
                {
                    throw new ApplicationException("Тема с таким названием уже есть!");
                }
            }
            else
            {
                if (Context.CourseProjects.Any(x => x.Theme == projectData.Theme && x.SubjectId == projectData.SubjectId))
                {
                    throw new ApplicationException("Тема с таким названием уже есть!");
                }

                project = new CourseProject();
                Context.CourseProjects.Add(project);
            }

            var currentGroups = project.CourseProjectGroups.ToList();
            var newGroups = projectData.SelectedGroupsIds.Select(x => new CourseProjectGroup { GroupId = x, CourseProjectId = project.CourseProjectId }).ToList();

            var groupsToAdd = newGroups.Except(currentGroups, grp => grp.GroupId);
            var groupsToDelete = currentGroups.Except(newGroups, grp => grp.GroupId);

            foreach (var projectGroup in groupsToAdd)
            {
                project.CourseProjectGroups.Add(projectGroup);
            }

            foreach (var projectGroup in groupsToDelete)
            {
                Context.CourseProjectGroups.Remove(projectGroup);
            }

            project.LecturerId = projectData.LecturerId.Value;
            project.Theme = projectData.Theme;
            project.SubjectId = projectData.SubjectId.Value;
            Context.SaveChanges();
        }

        public void DeleteProject(int userId, int id)
        {
            AuthorizationHelper.ValidateLecturerAccess(Context, userId);

            var project = Context.CourseProjects.Single(x => x.CourseProjectId == id);
            Context.CourseProjects.Remove(project);
            Context.SaveChanges();
        }

        public IEnumerable<AssignedCourseProject> GetAssignedCourseProjects(int subjectId) 
        {
            return Context.AssignedCourseProjects
                .Where(x => x.CourseProject != null && x.CourseProject.SubjectId == subjectId);
        }

        public void AssignProject(int userId, int projectId, int studentId)
        {
            var isLecturer = AuthorizationHelper.IsLecturer(Context, userId);
            var isStudent = AuthorizationHelper.IsStudent(Context, userId);
            studentId = isStudent ? userId : studentId;

            var courseProject = Context.CourseProjects.FirstOrDefault(x => x.CourseProjectId == projectId);

            if (courseProject == null || courseProject.SubjectId == null) 
            {
                throw new ApplicationException("Selected Cource Project can not be assigned!");
            }

            var assignment = Context.AssignedCourseProjects.FirstOrDefault(x => x.CourseProjectId == projectId);

            if (isStudent && assignment != null)
            {
                throw new ApplicationException("The selected Course Project has already been assigned!");
            }

            var studentAssignments = GetAssignedCourseProjects(courseProject.SubjectId.Value).Where(x => x.StudentId == studentId);

            if (isStudent && studentAssignments.Any(x => x.ApproveDate.HasValue))
            {
                throw new ApplicationException("You already have an assigned project!");
            }

            foreach (var studentAssignment in studentAssignments)
            {
                Context.AssignedCourseProjects.Remove(studentAssignment);
            }

            if (assignment == null)
            {
                assignment = new AssignedCourseProject
                {
                    CourseProjectId = projectId
                };

                Context.AssignedCourseProjects.Add(assignment);
            }

            assignment.StudentId = studentId == 0 ? assignment.StudentId : studentId;
            assignment.ApproveDate = isLecturer ? DateTime.UtcNow : null;
                      
            courseProject.DateStart = isLecturer ? DateTime.UtcNow : null;
            
            Context.SaveChanges();

            if (courseProject.Subject.IsNeededCopyToBts)
            {
                CreateBtsProject(courseProject, studentId);
            }
        }

        public void DeleteAssignment(int userId, int id)
        {
            AuthorizationHelper.ValidateLecturerAccess(Context, userId);

            var project = Context.AssignedCourseProjects.Single(x => x.CourseProjectId == id);
            var cp = Context.CourseProjects.FirstOrDefault(x => x.CourseProjectId == id);
            cp.DateStart = null;
            Context.AssignedCourseProjects.Remove(project);
            Context.SaveChanges();
        }

        public PagedList<StudentData> GetStudentsByCourseProjectId(GetPagedListParams parms)
        {
            if (!parms.Filters.ContainsKey("courseProjectId"))
            {
                throw new ApplicationException("coursePorjectId can't be empty!");
            }

            parms.SortExpression = "Group, Name";

            var courseProjectId = int.Parse(parms.Filters["courseProjectId"]);

            return Context.Students
                .Include(x => x.Group.CourseProjectGroups)
                .Where(x => x.Group.CourseProjectGroups.Any(dpg => dpg.CourseProjectId == courseProjectId))
                .Where(x => !x.AssignedCourseProjects.Any())
				.Where(x => x.Confirmed == null || x.Confirmed.Value)
                .Select(s => new StudentData
                {
                    Id = s.Id,
                    Name = s.MiddleName != null ? s.LastName + " " + s.FirstName + " " + s.MiddleName : s.LastName + " " + s.FirstName, //todo
                    Group = s.Group.Name
                }).ApplyPaging(parms);
        }

        public PagedList<StudentData> GetGraduateStudentsForUser(int userId, int subjectId, GetPagedListParams parms, bool getBySecretaryForStudent = true)
        {
            var secretaryId = 0;

            if (parms.Filters.ContainsKey("secretaryId"))
            {
                int.TryParse(parms.Filters["secretaryId"], out secretaryId);
            }

            var isStudent = AuthorizationHelper.IsStudent(Context, userId);
            var isLecturer = AuthorizationHelper.IsLecturer(Context, userId);
            var isLecturerSecretary = isLecturer && Context.Lecturers.Single(x => x.Id == userId).IsSecretary;
            secretaryId = isLecturerSecretary ? userId : secretaryId;
            if (isStudent)
            {
                if (getBySecretaryForStudent)
                {
                    secretaryId = Context.Users.Where(x => x.Id == userId).Select(x => x.Student.Group.SecretaryId).Single() ?? 0;
                }
                else
                {
                    userId = Context.Users.Where(x => x.Id == userId)
                            .Select(x => x.Student.AssignedCourseProjects.FirstOrDefault().CourseProject.LecturerId)
                            .Single() ?? 0;
                }
            }

            if (string.IsNullOrWhiteSpace(parms.SortExpression) || parms.SortExpression == "Id")
            {
                parms.SortExpression = "Name";
            }

            var query = Context.Students
                .Where(x => isLecturerSecretary || (isStudent && getBySecretaryForStudent) || x.AssignedCourseProjects.Any(asd => asd.CourseProject.LecturerId == userId && asd.CourseProject.SubjectId == subjectId))
                .Where(x => secretaryId == 0 || x.Group.SecretaryId == secretaryId)
                .Where(x => x.AssignedCourseProjects.Any(a => a.CourseProject.SubjectId == subjectId));

            return (from s in query
                    let lecturer = s.AssignedCourseProjects.FirstOrDefault().CourseProject.Lecturer
                    select new StudentData
                    {
                        Id = s.Id,
                        Name = s.LastName + " " + s.FirstName + " " + s.MiddleName, //todo
                        Mark = s.AssignedCourseProjects.FirstOrDefault().Mark,
                        AssignedCourseProjectId = s.AssignedCourseProjects.FirstOrDefault().Id,
                        Lecturer = lecturer.LastName + " " + lecturer.FirstName + " " + lecturer.MiddleName, //todo
                        Group = s.Group.Name,
                        PercentageResults = s.CoursePercentagesResults.Select(pr => new PercentageResultData
                        {
                            Id = pr.Id,
                            PercentageGraphId = pr.CoursePercentagesGraphId,
                            StudentId = pr.StudentId,
                            Mark = pr.Mark,
                            Comment = pr.Comments,
                            ShowForStudent = pr.ShowForStudent,
                        }),
                        CourseProjectConsultationMarks = s.CourseProjectConsultationMarks.Select(cm => new CourseProjectConsultationMarkData
                        {
                            Id = cm.Id,
                            ConsultationDateId = cm.ConsultationDateId,
                            StudentId = cm.StudentId,
                            Mark = cm.Mark,
                            Comments = cm.Comments,
                        })
                    }).ApplyPaging(parms);
        }

        public PagedList<StudentData> GetGraduateStudentsForGroup(int userId, int groupId, int subjectId, GetPagedListParams parms, bool getBySecretaryForStudent = true)
        {
            var secretaryId = 0;

            if (parms.Filters.ContainsKey("secretaryId"))
            {
                int.TryParse(parms.Filters["secretaryId"], out secretaryId);
            }

            var searchString = "";

            if (parms.Filters.ContainsKey("searchString"))
            {
                searchString = parms.Filters["searchString"];
            }

            var isStudent = AuthorizationHelper.IsStudent(Context, userId);
            var isLecturer = AuthorizationHelper.IsLecturer(Context, userId);

            if (isStudent)
            {
                userId = Context.Users.Where(x => x.Id == userId)
                     .Select(x => x.Student.AssignedCourseProjects.FirstOrDefault().CourseProject.LecturerId)
                     .Single() ?? 0;
            }

            if (string.IsNullOrWhiteSpace(parms.SortExpression) || parms.SortExpression == "Id")
            {
                parms.SortExpression = "Name";
            }

            var query = Context.Students
                .Where(x => x.GroupId == groupId)
                .Where(x => x.AssignedCourseProjects.Any(a => a.CourseProject.SubjectId == subjectId))
                .Where(x => x.AssignedCourseProjects.Any(a => a.CourseProject.LecturerId == userId));

            if (searchString.Length > 0)
            {
                return (from s in query
                        let lecturer = s.AssignedCourseProjects.FirstOrDefault().CourseProject.Lecturer
                        let cp = s.AssignedCourseProjects.FirstOrDefault()
                        where cp.CourseProject.Theme.Contains(searchString) || s.LastName.Contains(searchString)
                        select new StudentData
                        {
                            Id = s.Id,
                            Name = s.LastName + " " + s.FirstName + " " + s.MiddleName, //todo
                            Mark = cp.Mark,
                            AssignedCourseProjectId = cp.Id,
                            Lecturer = lecturer.LastName + " " + lecturer.FirstName + " " + lecturer.MiddleName, //todo
                            Group = cp.CourseProject.Theme,
                            Comment = cp.Comment,
                            ShowForStudent = cp.ShowForStudent,
                            LecturerName = cp.LecturerName,
                            MarkDate = cp.MarkDate,
                            PercentageResults = s.CoursePercentagesResults.Select(pr => new PercentageResultData
                            {
                                Id = pr.Id,
                                PercentageGraphId = pr.CoursePercentagesGraphId,
                                StudentId = pr.StudentId,
                                Mark = pr.Mark,
                                Comment = pr.Comments,
                                ShowForStudent = pr.ShowForStudent,
                            }),
                            CourseProjectConsultationMarks = s.CourseProjectConsultationMarks.Select(cm => new CourseProjectConsultationMarkData
                            {
                                Id = cm.Id,
                                ConsultationDateId = cm.ConsultationDateId,
                                StudentId = cm.StudentId,
                                Mark = cm.Mark,
                                Comments = cm.Comments
                            })
                        }).ApplyPaging(parms);
            }
            else
            {
                return (from s in query
                        let lecturer = s.AssignedCourseProjects.FirstOrDefault().CourseProject.Lecturer
                        let cp = s.AssignedCourseProjects.FirstOrDefault()
                        select new StudentData
                        {
                            Id = s.Id,
                            Name = s.LastName + " " + s.FirstName + " " + s.MiddleName, //todo
                            Mark = s.AssignedCourseProjects.FirstOrDefault().Mark,
                            AssignedCourseProjectId = s.AssignedCourseProjects.FirstOrDefault().Id,
                            Lecturer = lecturer.LastName + " " + lecturer.FirstName + " " + lecturer.MiddleName, //todo
                            Group = s.AssignedCourseProjects.FirstOrDefault().CourseProject.Theme,
                            Comment = cp.Comment,
                            ShowForStudent = cp.ShowForStudent,
                            LecturerName = cp.LecturerName,
                            MarkDate = cp.MarkDate,
                            PercentageResults = s.CoursePercentagesResults.Select(pr => new PercentageResultData
                            {
                                Id = pr.Id,
                                PercentageGraphId = pr.CoursePercentagesGraphId,
                                StudentId = pr.StudentId,
                                Mark = pr.Mark,
                                Comment = pr.Comments,
                                ShowForStudent = pr.ShowForStudent,
                            }),
                            CourseProjectConsultationMarks = s.CourseProjectConsultationMarks.Select(cm => new CourseProjectConsultationMarkData
                            {
                                Id = cm.Id,
                                ConsultationDateId = cm.ConsultationDateId,
                                StudentId = cm.StudentId,
                                Mark = cm.Mark,
                                Comments = cm.Comments
                            })
                        }).ApplyPaging(parms);
            }
        }

        public void SetStudentCourseProjectMark(int lecturerId, CourseStudentMarkModel courseStudentMarkModel)
        {
            AuthorizationHelper.ValidateLecturerAccess(Context, lecturerId);
            var assignedCourseProject = Context.AssignedCourseProjects.Single(x => x.Id == courseStudentMarkModel.AssignedProjectId);
            assignedCourseProject.Mark = courseStudentMarkModel.Mark;
            assignedCourseProject.MarkDate = courseStudentMarkModel.Date;
            assignedCourseProject.Comment = courseStudentMarkModel.Comment;
            assignedCourseProject.ShowForStudent = courseStudentMarkModel.ShowForStudent;
            assignedCourseProject.LecturerName = courseStudentMarkModel.LecturerName;
            Context.SaveChanges();
        }

        public CourseProjectTaskSheetTemplate GetTaskSheetTemplate(int id)
        {
            return Context.CourseProjectTaskSheetTemplates.Single(x => x.Id == id);
        }

        public PagedList<CourseProjectTaskSheetTemplate> GetTaskSheetTemplates(GetPagedListParams parms)
        {
            var lecturerId = int.Parse(parms.Filters["lecturerId"]);
            var query = Context.CourseProjectTaskSheetTemplates.Where(x => x.LecturerId == lecturerId);
            
            return query.ApplyPaging(parms);
        }

        public void SaveTaskSheetTemplate(CourseProjectTaskSheetTemplate template)
        {
            var existingTemplate = Context.CourseProjectTaskSheetTemplates.FirstOrDefault(x => x.Name.Trim() == template.Name.Trim())
                ?? Context.CourseProjectTaskSheetTemplates.SingleOrDefault(x => x.Id == template.Id);
            if (existingTemplate != null)
            {
                existingTemplate.Name = template.Name;
                existingTemplate.InputData = template.InputData;
                existingTemplate.Consultants = template.Consultants;
                existingTemplate.DrawMaterials = template.DrawMaterials;
                existingTemplate.RpzContent = template.RpzContent;
                existingTemplate.LecturerId = template.LecturerId;
                existingTemplate.Faculty = template.Faculty;
                existingTemplate.HeadCathedra = template.HeadCathedra;
                existingTemplate.Univer = template.Univer;
                existingTemplate.DateStart = template.DateStart;
                existingTemplate.DateEnd = template.DateEnd;
            }
            else
            {
                Context.CourseProjectTaskSheetTemplates.Add(template);
            }

            Context.SaveChanges();
        }

        public List<TaskSheetData> GetTaskSheets(int userId, GetPagedListParams parms)
        {
            var subjectId = int.Parse(parms.Filters["subjectId"]);
            var searchString = parms.Filters["searchString"];

            var query = Context.CourseProjects.AsNoTracking()
                .Include(x => x.Lecturer)
                .Include(x => x.AssignedCourseProjects.Select(asp => asp.Student.Group))
                .Include(x => x.Subject);

            var user = Context.Users.Include(x => x.Student).Include(x => x.Lecturer).SingleOrDefault(x => x.Id == userId);

            if (user != null && user.Lecturer != null)
            {
                query = query.Where(x => x.LecturerId == userId).Where(x => x.SubjectId == subjectId);
            }

            if (user != null && user.Student != null)
            {
                query = query.Where(x => x.CourseProjectGroups.Any(dpg => dpg.GroupId == user.Student.GroupId)).Where(x => x.SubjectId == subjectId);
            }

            if (searchString.Length > 0)
            {
                var taskSheets = from cp in query
                                 let acp = cp.AssignedCourseProjects.FirstOrDefault()
                                 where acp.Student.LastName.Contains(searchString) ||
                                        cp.Theme.Contains(searchString) ||
                                        acp.Student.Group.Name.Contains(searchString)
                                 select new TaskSheetData
                                 {
                                     CourseProjectId = cp.CourseProjectId,
                                     InputData = cp.InputData,
                                     Consultants = cp.Consultants,
                                     DrawMaterials = cp.DrawMaterials,
                                     RpzContent = cp.RpzContent,
                                     Faculty = cp.Faculty,
                                     HeadCathedra = cp.HeadCathedra,
                                     Univer = cp.Univer,
                                     DateEnd = cp.DateEnd,
                                     DateStart = cp.DateStart
                                 };

                return taskSheets.ToList();
            }
            else
            {
                var taskSheets = from cp in query
                                     let acp = cp.AssignedCourseProjects.FirstOrDefault()
                                     select new TaskSheetData
                                     {
                                         CourseProjectId = cp.CourseProjectId,
                                         InputData = cp.InputData,
                                         Consultants = cp.Consultants,
                                         DrawMaterials = cp.DrawMaterials,
                                         RpzContent = cp.RpzContent,
                                         Faculty = cp.Faculty,
                                         HeadCathedra = cp.HeadCathedra,
                                         Univer = cp.Univer,
                                         DateEnd = cp.DateEnd,
                                         DateStart = cp.DateStart
                                     };

                return taskSheets.ToList();
            }
        }

        public TaskSheetData GetTaskSheet(int courseProjectId)
        {
            var dp = Context.CourseProjects.Single(x => x.CourseProjectId == courseProjectId);
            
            return new TaskSheetData
            {
                InputData = dp.InputData,
                Consultants = dp.Consultants,
                CourseProjectId = dp.CourseProjectId,
                DrawMaterials = dp.DrawMaterials,
                RpzContent = dp.RpzContent,
                Faculty = dp.Faculty,
                HeadCathedra = dp.HeadCathedra,
                Univer = dp.Univer,
                DateEnd = dp.DateEnd,
                DateStart = dp.DateStart
                
            };
        }

        public string GetTasksSheetHtml(int courseProjectId)
        {
            // TODO
            var courseProject =
                new LmPlatformModelsContext().CourseProjects
                    .Include(x => x.AssignedCourseProjects.Select(y => y.Student.Group))
                    .Single(x => x.CourseProjectId == courseProjectId);

            return courseProject.AssignedCourseProjects.Count == 1
                ? WordCourseProject.CourseProjectToDocView(courseProject.AssignedCourseProjects.First())
                : WordCourseProject.CourseProjectToDocView(courseProject);
        }

        public void SaveTaskSheet(int userId, TaskSheetData taskSheet)
        {
            AuthorizationHelper.ValidateLecturerAccess(Context, userId);

            var courseProject = Context.CourseProjects.Single(x => x.CourseProjectId == taskSheet.CourseProjectId);

            courseProject.InputData = taskSheet.InputData;
            courseProject.RpzContent = taskSheet.RpzContent;
            courseProject.DrawMaterials = taskSheet.DrawMaterials;
            courseProject.Consultants = taskSheet.Consultants;
            courseProject.HeadCathedra = taskSheet.HeadCathedra;
            courseProject.Faculty = taskSheet.Faculty;
            courseProject.Univer = taskSheet.Univer;
            courseProject.DateStart = taskSheet.DateStart;
            courseProject.DateEnd = taskSheet.DateEnd;

            Context.SaveChanges();
        }

        public SubjectData GetSubject(int id)
        {
            SubjectData sub = new SubjectData();
            Subject subject = new Subject();
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                subject = repositoriesContainer.SubjectRepository.GetBy(new Query<Subject>(e => e.Id == id)
                    .Include(e => e.SubjectGroups));    
            }

            sub.Id = subject.Id;
            sub.Name = subject.Name;
            sub.ShortName = subject.ShortName;
            sub.IsNeededCopyToBts = subject.IsNeededCopyToBts;

            return sub;
        }

        public List<Correlation> GetGroups(int subjectId)
        {
            var groups = Context.Groups.Where(s => s.SubjectGroups.Any(d => d.SubjectId == subjectId && d.IsActiveOnCurrentGroup));

            return groups.OrderBy(x => x.Name).Select(x => new Correlation
            {
                Id = x.Id,
                Name = x.Name
            }).ToList();
        }

        public List<NewsData> GetNewses(int userId, int subjectId)
        {
            var newses = Context.CourseProjectNewses.Where(x => x.SubjectId == subjectId).OrderByDescending(x=>x.EditDate);

            List<NewsData> list = new List<NewsData>();
            foreach (CourseProjectNews cp in newses)
            {
                NewsData n = new NewsData();
                n.Id = cp.Id;
                n.Title = cp.Title;
                n.Body = cp.Body;
                n.SubjectId = cp.SubjectId;
                n.DateCreate = cp.EditDate.ToShortDateString();
                n.Disabled = cp.Disabled;
                n.PathFile = cp.Attachments;
                n.Attachments = FilesManagementService.GetAttachments(cp.Attachments);
                list.Add(n);
            }

            return list;
        }

        public void SetSelectedGroupsToCourseProjects(int subjectId, List<int> groupIds)
        {
            var projects = Context.CourseProjects.Where(e => e.SubjectId == subjectId).Include(x => x.CourseProjectGroups);
            
            foreach (var project in projects)
            {
                foreach (int groupId in groupIds)
                {
                    CourseProjectGroup projectGroup = new CourseProjectGroup() {
                        CourseProjectId = project.CourseProjectId,
                        GroupId = groupId
                    };
                    project.CourseProjectGroups.Add(projectGroup);
                }
            }

            Context.SaveChanges();
        }

        public HttpResponseMessage DownloadTaskSheet(int courseProjectId)
        {
            var courseProject = Context.CourseProjects
                .Include(x =>
                    x.AssignedCourseProjects
                        .Select(y => y.Student.Group.Secretary.CoursePercentagesGraphs))
                .Single(x => x.CourseProjectId == courseProjectId);

            string docName;

            if (courseProject.AssignedCourseProjects.Count == 1)
            {
                var stud = courseProject.AssignedCourseProjects.Single().Student;
                docName = $"{stud.LastName}_{stud.FirstName}";
            }
            else
            {
                docName = $"{courseProject.Theme}";
            }

            return WordCourseProject.CourseProjectToWord(docName, courseProject);
        }

        public HttpResponseMessage DownloadTaskSheet(int groupId, int subjectId)
        {
            var courseProjects = new LmPlatformModelsContext().CourseProjects
                .Where(x => x.SubjectId == subjectId && x.LecturerId == UserContext.CurrentUserId)
                .Where(x => x.AssignedCourseProjects.Count() == 1)
                .Include(x =>
                    x.AssignedCourseProjects.Select(y => y.Student.Group.Secretary.CoursePercentagesGraphs))
                .Where(x => x.AssignedCourseProjects.FirstOrDefault().Student.GroupId == groupId).ToList();

            string fileName = "NoTaskSheet.zip";
            if (courseProjects.Any())
            {
                fileName = courseProjects.FirstOrDefault().AssignedCourseProjects.FirstOrDefault().Student.Group.Name + ".zip";

                return WordCourseProject.CourseProjectsToArchive(fileName, courseProjects);
            }

            return WordCourseProject.CourseProjectsToArchive(fileName, courseProjects);
            
        }

        public async Task DeleteTaskSheetAsync(int taskSheetId, int userId)
        {
            AuthorizationHelper.ValidateLecturerAccess(Context, userId);

            var taskSheet = await Context.CourseProjectTaskSheetTemplates.FirstOrDefaultAsync(x => x.Id == taskSheetId);

            if (taskSheet is not null)
            {
                Context.CourseProjectTaskSheetTemplates.Remove(taskSheet);
                Context.SaveChanges();
            }
        }

        private void CreateBtsProject(CourseProject courseProject, int developerId)
        {            
            int lecturerId = (int)courseProject.LecturerId;
            var project = new Project();
            project.CreatorId = lecturerId;
            project.Title = courseProject.Theme;
            project.DateOfChange = DateTime.Now;
            ProjectManagementService.SaveProject(project);

            ProjectManagementService.AssingRole(new ProjectUser
            {
                UserId = lecturerId,
                ProjectId = project.Id,
                ProjectRoleId = ProjectRole.Leader
            });

            ProjectManagementService.AssingRole(new ProjectUser
            {
                UserId = developerId,
                ProjectId = project.Id,
                ProjectRoleId = ProjectRole.Developer
            });
        }

        private string GetGuidFileName()
        {
            return string.Format("P{0}", Guid.NewGuid().ToString("N").ToUpper());
        }

        public CourseProjectNews SaveNews(CourseProjectNews news, IList<Attachment> attachments, Int32 userId)
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
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
            }

            var cpEditNews = Context.CourseProjectNewses.FirstOrDefault(x => x.Id == news.Id && x.SubjectId == news.SubjectId);
            
            if (cpEditNews != null)
            {
                CourseProjectNews cpnews = new CourseProjectNews();
                cpEditNews.Body = news.Body;
                cpEditNews.Disabled = news.Disabled;
                cpEditNews.EditDate = news.EditDate;
                cpEditNews.SubjectId = news.SubjectId;
                cpEditNews.Attachments = news.Attachments;
                cpEditNews.Title = news.Title;
            }
            else 
            {
                Context.CourseProjectNewses.Add(news);
            }

            Context.SaveChanges();

            return news;
        }

        public async Task<DeleteNewsMessage> DeleteNewsAsync(CourseProjectNews news)
        {
            var courseProjectNews = await Context.CourseProjectNewses.FirstOrDefaultAsync(x => x.Id == news.Id && x.SubjectId==news.SubjectId);

            if (courseProjectNews is null)
            {
                return new DeleteNewsMessage()
                {
                    Message = "Новость не существует",
                    IsError = true
                };
            }

            Context.CourseProjectNewses.Remove(courseProjectNews);
            Context.SaveChanges();

            return new DeleteNewsMessage()
            {
                Message = "Объявление успешно удалено",
                IsError = false
            };
        }

        public void DisableNews(int subjectId, bool disable)
        {
           var models = Context.CourseProjectNewses.Where(e => e.SubjectId == subjectId);

           foreach (var cpNews in models)
           {
               cpNews.Disabled = disable;
           }

           Context.SaveChanges();
        }

        public CourseProjectNews GetNews(int id)
        {
            return Context.CourseProjectNewses.Single(x => x.Id == id);
        }

        public void DeleteUserFromAcpProject(int id, int projectId)
        {
            var acp = Context.AssignedCourseProjects.Single(e => e.CourseProjectId == projectId && e.StudentId == id);
            Context.AssignedCourseProjects.Remove(acp);
            Context.SaveChanges();
        }

        public void DeletePercentageAndVisitStatsForUser(int id)
        {
            var cpPR = Context.CoursePercentagesResults.Where(e => e.StudentId == id);
            
            foreach(var cp in cpPR)
            {
                Context.CoursePercentagesResults.Remove(cp);
            }

            var cpVS = Context.CourseProjectConsultationMarks.Where(e => e.StudentId == id);
            
            foreach (var cp in cpVS)
            {
                Context.CourseProjectConsultationMarks.Remove(cp);
            }

            Context.SaveChanges();
        }
    }
}
