using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Mvc;
using System.Web.Security;
using Application.Core;
using Application.Core.Data;
using Application.Core.Exceptions;
using Application.Core.UI.Controllers;
using Application.Infrastructure.DPManagement;
using Application.Infrastructure.ElasticManagement;
using Application.Infrastructure.FilesManagement;
using Application.Infrastructure.GroupManagement;
using Application.Infrastructure.LecturerManagement;
using Application.Infrastructure.StudentManagement;
using Application.Infrastructure.SubjectManagement;
using Application.Infrastructure.UserManagement;
using LMPlatform.Models;
using LMPlatform.UI.Attributes;
using LMPlatform.UI.Helpers;
using LMPlatform.UI.ViewModels.AccountViewModels;
using LMPlatform.UI.ViewModels.AdministrationViewModels;


namespace LMPlatform.UI.Controllers
{
    [JwtAuth(Roles = "admin")]
    public class AdministrationController : BasicController
    {
        private readonly LazyDependency<IFilesManagementService> _filesManagementService;
        private readonly LazyDependency<IElasticManagementService> _elasticManagementService;

        public IElasticManagementService ElasticManagementService => _elasticManagementService.Value;
        public IFilesManagementService FilesManagementService => _filesManagementService.Value;
        public IStudentManagementService StudentManagementService => ApplicationService<IStudentManagementService>();
        public ISubjectManagementService SubjectManagementService => ApplicationService<ISubjectManagementService>();
        public IGroupManagementService GroupManagementService => ApplicationService<IGroupManagementService>();
        public ILecturerManagementService LecturerManagementService => ApplicationService<ILecturerManagementService>();
        public IUsersManagementService UsersManagementService => ApplicationService<IUsersManagementService>();
        public IDpManagementService DpManagementService => ApplicationService<IDpManagementService>();


        public AdministrationController()
        {
            _filesManagementService = new LazyDependency<IFilesManagementService>();
            _elasticManagementService = new LazyDependency<IElasticManagementService>();
        }


        [HttpGet]
        public ActionResult UserActivityJson()
        {
            var activityModel = new UserActivityViewModel();

            var responseObj = new
            {
                activityModel.ServiceAccountsCount,
                activityModel.TotalLecturersCount,
                activityModel.TotalStudentsCount,
                activityModel.TotalUsersCount,
                activityModel.UserActivityJson
            };

            return JsonResponse(responseObj);
        }

        [HttpGet]
        public ActionResult GetFiles()
        {
            try
            {
                var attachments = this.FilesManagementService.GetAttachments(null)
                    .Select(attachment => new AttachmentViewModel(attachment))
                    .ToList();

                var storageRoot = ConfigurationManager.AppSettings["FileUploadPath"];
                var result = new 
                {
                    Files = attachments,
                    ServerPath = storageRoot,
                    Message = "Данные успешно загружены",
                    Code = "200"
                };

                return JsonResponse(result);
            }
            catch
            {
                return StatusCode(HttpStatusCode.InternalServerError);
            }
        }

        [HttpGet]
        public async Task<ActionResult> GetFilesPagedJsonAsync(int pageIndex, int pageSize, string? filter, string? orderBy, SortDirection sortDirection = SortDirection.Asc) 
        {
            var pageInfo = new PageInfo
            {
                PageNumber = pageIndex + 1,
                PageSize = pageSize
            };

            var sortCriteria = !string.IsNullOrEmpty(orderBy) ? new SortCriteria
            {
                Name = orderBy,
                SortDirection = sortDirection
            } : null;

            IPageableList<Attachment> attachments;

            try
            {
                attachments = await FilesManagementService.GetAttachmentsPageableAsync(filter, pageInfo, sortCriteria);
            }
            catch (SortCriteriaException)
            {
                return StatusCode(HttpStatusCode.BadRequest);
            }

            var items = attachments.Items.Select(a => new AttachmentViewModel(a));

            var response = new FilesPageViewModel<AttachmentViewModel>
            {
                Items = items,
                PageInfo = pageInfo,
                TotalCount = attachments.TotalCount,
                ServerPath = ConfigurationManager.AppSettings["FileUploadPath"]
            };

            return JsonResponse(response);
        }

        [HttpGet]
        public ActionResult StudentsJson()
        {
            var students = this.StudentManagementService.GetStudents();

            var result = students.Select(s => StudentViewModel.FromStudent(s, null));

            return JsonResponse(result);
        }

        [HttpGet]
        public async Task<ActionResult> GetStudentsPagedJsonAsync(int pageIndex, int pageSize, string? filter, string? orderBy, SortDirection sortDirection = SortDirection.Asc)
        {
            var pageInfo = new PageInfo
            {
                PageNumber = pageIndex + 1,
                PageSize = pageSize
            };

            var sortCriteria = !string.IsNullOrEmpty(orderBy) ? new SortCriteria
            {
                Name = orderBy,
                SortDirection = sortDirection
            } : null;

            IPageableList<Student> students;

            try
            {
                students = await StudentManagementService.GetStudentsPageableAsync(filter, pageInfo, sortCriteria);
            }
            catch (SortCriteriaException)
            {
                return StatusCode(HttpStatusCode.BadRequest);
            }

            var items = students.Items.Select(s => StudentViewModel.FromStudent(s, null));

            var response = new PageViewModel<StudentViewModel>
            {
                Items = items,
                PageInfo = pageInfo,
                TotalCount = students.TotalCount
            };

            return JsonResponse(response);
        }

        [HttpGet]
        public ActionResult GetStudentJson(int id)
        {
            var student = this.StudentManagementService.GetStudent(id);

            if (student == null) return StatusCode(HttpStatusCode.BadRequest);
            var model = new ModifyStudentViewModel(student);

            return JsonResponse(model);
        }

        [HttpGet]
        public async Task<ActionResult> GetStudentByNameJsonAsync(string userName)
        {
            var user = await this.UsersManagementService.GetUserAsync(userName);

            if (user is null)
            {
                return StatusCode(HttpStatusCode.BadRequest);
            }

            var student = await this.StudentManagementService.GetStudentAsync(user.Id);

            if (student is null)
            {
                return StatusCode(HttpStatusCode.BadRequest);
            }

            var model = new ModifyStudentViewModel(student);
            return JsonResponse(model);
        }

        [HttpPost]
        public ActionResult SaveStudentJson(ModifyStudentViewModel model)
        {
            if (!this.ModelState.IsValid) return StatusCode(HttpStatusCode.BadRequest);
            try
            {
                var user = this.UsersManagementService.GetUser(model.Id);

                if (user != null)
                {
                    model.ModifyStudent();
                    return StatusCode(HttpStatusCode.OK);
                }
            }
            catch
            {
                return StatusCode(HttpStatusCode.InternalServerError);
            }

            return StatusCode(HttpStatusCode.BadRequest);
        }

        [HttpPost]
        public async Task<ActionResult> RestoreStudentAsync(int id)
        {
            var student = await StudentManagementService.GetStudentAsync(id);

            if (student == null)
            {
                return StatusCode(HttpStatusCode.BadRequest);
            }

            student.IsActive = true;

            var studentManagementTask = StudentManagementService.RestoreStudentAsync(student);
            var elasticServiceTask = ElasticManagementService.ModifyStudentAsync(student);

            await Task.WhenAll(studentManagementTask, elasticServiceTask);

            return StatusCode(HttpStatusCode.OK);
        }

        [HttpGet]
        public async Task<ActionResult> GetProfessorsPagedJsonAsync(int pageIndex, int pageSize, string? filter, string? orderBy, SortDirection sortDirection = SortDirection.Asc) 
        {
            var pageInfo = new PageInfo
            {
                PageNumber = pageIndex + 1,
                PageSize = pageSize
            };

            var sortCriteria = !string.IsNullOrEmpty(orderBy) ? new SortCriteria
            {
                Name = orderBy,
                SortDirection = sortDirection
            } : null;

            IPageableList<Lecturer> lecturers;

            try
            {
                lecturers = await LecturerManagementService.GetLecturersPageableAsync(filter, pageInfo, sortCriteria);
            }
            catch (SortCriteriaException) 
            {
                return StatusCode(HttpStatusCode.BadRequest);
            }

            var items = lecturers.Items.Select(l => LecturerViewModel.FormLecturers(l, null));

            var response = new PageViewModel<LecturerViewModel> 
            {
                Items = items,
                PageInfo = pageInfo,
                TotalCount = lecturers.TotalCount
            };

            return JsonResponse(response);
        }

        [HttpPost]
        public ActionResult AddProfessorJson(RegisterViewModel model)
        {
            if (!this.ModelState.IsValid) return StatusCode(HttpStatusCode.BadRequest);
            try
            {
                var user = this.UsersManagementService.GetUserByName(model.Name, model.Surname, model.Patronymic);

                if (user == null)
                {
                    model.RegistrationUser(new[] {"lector"});
                    return StatusCode(HttpStatusCode.OK);
                }
            }
            catch
            {
                return StatusCode(HttpStatusCode.InternalServerError);
            }

            return StatusCode(HttpStatusCode.BadRequest);
        }

        [HttpGet]
        public ActionResult GetProfessorJson(int id)
        {
            var lecturer = this.LecturerManagementService.GetLecturer(id);

            if (lecturer == null) return StatusCode(HttpStatusCode.BadRequest);
            var model = LecturerViewModel.FormLecturers(lecturer, null);
            return JsonResponse(model);
        }

        [HttpGet]
        public async Task<ActionResult> GetProfessorByNameJsonAsync(string userName) 
        {
            var user = await this.UsersManagementService.GetUserAsync(userName);

            if (user is null)
            {
                return StatusCode(HttpStatusCode.BadRequest);
            }

            var lecturer = await this.LecturerManagementService.GetLecturerAsync(user.Id);

            if (lecturer is null) 
            {
                return StatusCode(HttpStatusCode.BadRequest);
            }

            var model = LecturerViewModel.FormLecturers(lecturer, null);
            return JsonResponse(model);
        }

        [HttpPost]
        public ActionResult SaveProfessorJson(ModifyLecturerViewModel model)
        {
            if (!this.ModelState.IsValid) return StatusCode(HttpStatusCode.BadRequest);
            try
            {
                model.ModifyLecturer();

                return StatusCode(HttpStatusCode.OK);
            }
            catch(Exception ex)
            {
                return StatusCode(HttpStatusCode.InternalServerError, ex.StackTrace);
            }
        }

        [HttpPost]
        public ActionResult AddGroupJson(GroupViewModel model)
        {
            if (!this.ModelState.IsValid) return StatusCode(HttpStatusCode.BadRequest, "Невалидная модель.");
            try
            {
                if (!model.CheckGroupName())
                {
                    return StatusCode(HttpStatusCode.BadRequest, "Группа с таким именем уже существует.");
                }

                model.AddGroup();
                return StatusCode(HttpStatusCode.OK);
            }
            catch (MembershipCreateUserException e)
            {
                return StatusCode(HttpStatusCode.InternalServerError, e.Message);
            }
        }

        [HttpGet]
        public ActionResult GetGroupJson(int id)
        {
            var group = this.GroupManagementService.GetGroup(id);

            if (group == null) return StatusCode(HttpStatusCode.BadRequest);
            var model = new GroupViewModel(group);
            return JsonResponse(model);
        }

        [HttpPost]
        public ActionResult SaveGroupJson(GroupViewModel model)
        {
            if (!this.ModelState.IsValid) return StatusCode(HttpStatusCode.BadRequest, "Невалидная модель.");
            try
            {
                model.ModifyGroup();
                return StatusCode(HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                return StatusCode(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        public ActionResult GetProfessorsJson()
        {
            var lecturers = this.LecturerManagementService.GetLecturers();

            var responseModel = lecturers.Select(l => LecturerViewModel.FormLecturers(l, null));

            return JsonResponse(responseModel);
        }

        [HttpGet]
        [AllowAnonymous]
        public ActionResult GetGroupsJson()
        {
            var groups = this.GroupManagementService.GetGroups(new Query<Group>()
                .Include(e => e.Students)
                .Include(e => e.SubjectGroups)
                );

            var responseModel = groups.Select(l => GroupViewModel.FormGroup(l, null));

            return JsonResponse(responseModel);
        }

        [HttpGet]
        public async Task<ActionResult> GetGroupsPagedJsonAsync(int pageIndex, int pageSize, string? filter, string? orderBy, SortDirection sortDirection = SortDirection.Asc) 
        {
            var pageInfo = new PageInfo
            {
                PageNumber = pageIndex + 1,
                PageSize = pageSize
            };

            var sortCriteria = !string.IsNullOrEmpty(orderBy) ? new SortCriteria
            {
                Name = orderBy,
                SortDirection = sortDirection
            } : null;

            IPageableList<Group> groups;

            try
            {
                groups = await GroupManagementService.GetGroupsPageableAsync(filter, pageInfo, sortCriteria);
            }
            catch (SortCriteriaException)
            {
                return StatusCode(HttpStatusCode.BadRequest);
            }

            var items = groups.Items.Select(g => GroupViewModel.FormGroup(g, null));

            var response = new PageViewModel<GroupViewModel>
            {
                Items = items,
                PageInfo = pageInfo,
                TotalCount = groups.TotalCount
            };

            return JsonResponse(response);
        }


        [HttpGet]
        [AllowAnonymous]
        public ActionResult getGraduateGroupsJson()
        {
            var groups = this.GroupManagementService.GetGroups(new Query<Group>()
                .Include(e => e.Students)
                .Include(e => e.SubjectGroups)
                ).Where(g=> g.GraduationYear == DateTime.Now.Year.ToString());

            var responseModel = groups.Select(l => GroupViewModel.FormGroup(l, null));

            return JsonResponse(responseModel);
        }
        

        [HttpGet]
        public ActionResult GetSubjectsJson(int id)
        {
            var subjects = this.SubjectManagementService.GetSubjectsByStudent(id).OrderBy(subject => subject.Name)
                .ToList();
            var student = this.StudentManagementService.GetStudent(id);

            if (subjects.Count <= 0) return StatusCode(HttpStatusCode.BadRequest);
            var model = ListSubjectViewModel.FormSubjects(subjects, student.FullName);
            return JsonResponse(model);

        }

        [HttpGet]
        public ActionResult GetResetPasswordModelJson(int id)
        {
            try
            {
                var user = this.UsersManagementService.GetUser(id);

                var resetPassModel = new ResetPasswordViewModel(user);

                return JsonResponse(resetPassModel);
            }
            catch (Exception ex)
            {
                return StatusCode(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpPost]
        public ActionResult ResetPasswordJson(ResetPasswordViewModel model)
        {
            if (!this.ModelState.IsValid) return StatusCode(HttpStatusCode.BadRequest, "Invalid model.");
            var resetResult = model.ResetPassword();

            return !resetResult ? StatusCode(HttpStatusCode.Conflict, "Password hasn't been reseted.") : StatusCode(HttpStatusCode.OK);

        }

        [HttpPost]
        public ActionResult DeleteUserJson(int id)
        {
            try
            {
                var deleted = this.UsersManagementService.DeleteUser(id);

                if (deleted) return StatusCode(HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                return StatusCode(HttpStatusCode.InternalServerError, ex.Message);
            }

            return StatusCode(HttpStatusCode.BadRequest);
        }

        [HttpGet]
        public ActionResult AttendanceJson(int id)
        {
            var user = UsersManagementService.GetUser(id);

            if (user == null) 
            {
                return StatusCode(HttpStatusCode.BadRequest);
            }

            if (user.Attendances == null)
            {
                return StatusCode(HttpStatusCode.BadRequest);
            }

            var logins = user.Attendances.Select(a => a.Login.ToString("o"));

            var viewModel = new AttendanceViewModel
            {
                FullName = user.FullName,
                Logins = logins
            };

            return JsonResponse(viewModel);
        }

        [HttpGet]
        public async Task<ActionResult> DeleteStudentJson(int id)
        {
            try
            {
                var student = await this.StudentManagementService.GetStudentAsync(id);

                if (student == null) return StatusCode(HttpStatusCode.BadRequest);
                var result = await this.StudentManagementService.DeleteStudentAsync(id);
                await this.ElasticManagementService.DeleteStudentAsync(id);

                return StatusCode(result ? HttpStatusCode.OK : HttpStatusCode.Conflict);

            }
            catch (Exception ex)
            {
                return StatusCode(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        public ActionResult DeleteLecturerJson(int id)
        {
            try
            {
                var lecturer = this.LecturerManagementService.GetLecturer(id);

                if (lecturer == null) return StatusCode(HttpStatusCode.BadRequest);
                if (lecturer.SubjectLecturers != null && lecturer.SubjectLecturers.Any() &&
                    lecturer.SubjectLecturers.All(e => e.Subject.IsArchive))
                    foreach (var lecturerSubjectLecturer in lecturer.SubjectLecturers)
                        this.LecturerManagementService.DisjoinOwnerLector(lecturerSubjectLecturer.SubjectId, id);

                var result = this.LecturerManagementService.DeleteLecturer(id);
                this.ElasticManagementService.DeleteLecturer(id);

                return StatusCode(result ? HttpStatusCode.OK : HttpStatusCode.Conflict);

            }
            catch (Exception ex)
            {
                return StatusCode(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        public ActionResult DeleteGroupJson(int id)
        {
            try
            {
                var group = this.GroupManagementService.GetGroup(id);
                if (group == null) return StatusCode(HttpStatusCode.BadRequest);
                if (group.Students != null && group.Students.Count > 0) return StatusCode(HttpStatusCode.Conflict);

                this.GroupManagementService.DeleteGroup(id);
                this.ElasticManagementService.DeleteGroup(id);
                return StatusCode(HttpStatusCode.OK);

            }
            catch (Exception ex)
            {
                return StatusCode(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        public ActionResult ListOfGroupsByLecturerJson(int id)
        {
            var sub = this.SubjectManagementService.GetSubjectsByLector(id).OrderBy(subject => subject.Name).ToList();
            var lec = this.LecturerManagementService.GetLecturer(id);
            if (lec == null) return StatusCode(HttpStatusCode.BadRequest);
            var model = ListSubjectViewModel.FormSubjects(sub, lec.FullName);
            
            var response = new
            {
                Lecturer = model.Name,
                Subjects = model.Subjects.Distinct().Select(s => new
                {
                    SubjectName = s.Name,
                    SubjectAuthorName = SubjectLecturerHelper.GetAuthorName(s, lec.Id) ?? model.Name,
                    Groups = s.SubjectGroups.Where(sg => sg.Group != null).Select(sg => new
                    {
                        GroupName = sg.Group.Name,
                        StudentsCount = sg.Group.Students.Count,
                        IsActive = sg.IsActiveOnCurrentGroup    
                    }).OrderBy(g => g.GroupName)
                })
            };
            return JsonResponse(response);

        }

        [HttpGet]
        public ActionResult ListOfSubjectsByStudentJson(int id)
        {
            var subjects = this.SubjectManagementService.GetSubjectsByStudent(id).OrderBy(subject => subject.Name)
                .ToList();
            var stud = this.StudentManagementService.GetStudent(id);

            if (stud == null) return StatusCode(HttpStatusCode.BadRequest);
            var model = ListSubjectViewModel.FormSubjects(subjects, stud.FullName);
            var response = new
            {
                Student = model.Name,
                Subjects = model.Subjects.Select(s => new
                {
                    SubjectName = s.Name,
                    IsActiveOnGroup = s.SubjectGroups?.Select(prof => prof.IsActiveOnCurrentGroup),
                    Lecturers = s.SubjectLecturers?.Select(prof => prof.Lecturer.FullName)
                })
            };
            return JsonResponse(response);

        }

        [HttpGet]
        public ActionResult ListOfAllSubjectsByStudentJson(int id)
        {
            var subjects = this.SubjectManagementService.GetAllSubjectsByStudent(id).OrderBy(subject => subject.Name)
                .ToList();
            var stud = this.StudentManagementService.GetStudent(id);

            if (stud == null) return StatusCode(HttpStatusCode.BadRequest);

            return getSubjectInfo(subjects, stud.FullName, stud.GroupId);

        }

        [HttpGet]
        public ActionResult ListOfAllSubjectsByGroupJson(int id)
        {
            var subjects = this.SubjectManagementService.GetSubjectsInfoByGroup(id).OrderBy(subject => subject.Name)
                .ToList();

            var Group= this.GroupManagementService.GetGroup(id);

            if (Group == null) return StatusCode(HttpStatusCode.BadRequest);

            return getSubjectInfo(subjects, Group.Name, Group.Id);
            
        }


        private ActionResult getSubjectInfo(List<Subject> subjects, string name, int groupId)
        {
            var model = ListSubjectViewModel.FormSubjects(subjects, name);
            var response = new
            {
                Owner = model.Name,
                Subjects = model.Subjects.Select(s => new
                {
                    SubjectName = s.Name,
                    IsActiveOnGroup = s.SubjectGroups?.First(s=>s.GroupId == groupId).IsActiveOnCurrentGroup,
                    Lecturers = s.SubjectLecturers?.Select(prof => prof.Lecturer.FullName).ToHashSet()
                })
            };
            return JsonResponse(response);

        }

        [HttpGet]
        public ActionResult ListOfStudentsByGroupJson(int id)
        {
            try
            {
                var students = this.StudentManagementService.GetGroupStudents(id)
                    .OrderBy(student => student.FullName)
                    .ToList();

                var response = new
                {
                    Group = students.Count > 0 ? students[0].Group.Name : null,
                    Students = students.Select(s => new
                    {
                        Name = s.FullName,
                        IsConfirmed = s.Confirmed ?? false
                    })
                };
                return JsonResponse(response);
            }
            catch (Exception ex)
            {
                return StatusCode(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpPost]
        public ActionResult EditStudentJson(ModifyStudentViewModel model)
        {
            if (!this.ModelState.IsValid) return StatusCode(HttpStatusCode.BadRequest);
            try
            {
                model.ModifyStudent();
                return StatusCode(HttpStatusCode.Created, "Студент сохранен");
            }
            catch (Exception ex)
            {
                return StatusCode(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}