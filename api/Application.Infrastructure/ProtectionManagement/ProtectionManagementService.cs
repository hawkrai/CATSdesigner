using Application.Core.Data;
using Application.Infrastructure.Models;
using LMPlatform.Data.Repositories;
using LMPlatform.Models;
using System.Collections.Generic;
using System.Linq;

namespace Application.Infrastructure.ProtectionManagement
{
    public class ProtectionManagementService : IProtectionManagementService
    {
        public void CancelLab(int labId, int studentId)
        {
            using(var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                var jobProtection = repositoriesContainer.ProtectionRepository.GetLabJobProtection(labId, studentId);
                jobProtection.IsReceived = false;
                jobProtection.IsReturned = false;
                repositoriesContainer.ProtectionRepository.Save(jobProtection);
                repositoriesContainer.ApplyChanges();
            }
        }

        public IEnumerable<IEnumerable<StudentJobProtection>> GetGroupLabsJobProtection(int subjectId, int groupId)
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                var labs = repositoriesContainer.LabsRepository.GetAll(new Query<Labs>(x => x.SubjectId == subjectId)).ToList();

                var group = repositoriesContainer.RepositoryFor<SubjectGroup>().GetBy(new Query<SubjectGroup>(x => x.GroupId == groupId && x.SubjectId == subjectId)
                    .Include(x => x.SubjectStudents.Select(x => x.Student))
                    .Include(x => x.SubjectStudents.Select(x => x.SubGroup)));
;

                var jobProtections = repositoriesContainer.ProtectionRepository.GetAll(new Query<JobProtection>
                    (x => x.Student.GroupId == groupId && x.Lab.SubjectId == subjectId))
                    .ToList();

                return group.SubjectStudents.Select(x => labs.Select(lab => 
                    {
                        var labJobProtection = jobProtections.FirstOrDefault(j => j.LabId == lab.Id);
                        return new StudentJobProtection
                        {
                            IsReceived = labJobProtection?.IsReceived ?? false,
                            IsReturned = labJobProtection?.IsReturned ?? false,
                            LabId = lab.Id,
                            StudentId = x.StudentId,
                            Lab = lab,
                            Student = x
                        };
                    })
                );

            }
        }

        public IEnumerable<StudentJobProtection> GetStudentLabsJobProtection(int subjectId, int studentId)
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                var labs = repositoriesContainer.LabsRepository.GetAll(new Query<Labs>(x => x.SubjectId == subjectId)).ToList();
                var student = repositoriesContainer.RepositoryFor<SubjectStudent>().GetAll(new Query<SubjectStudent>(x => x.StudentId == studentId)
                    .Include(x => x.Student))
                    .FirstOrDefault();
                var jobProtections = repositoriesContainer.ProtectionRepository.GetAll(new Query<JobProtection>(x => x.StudentId == studentId && x.Lab.SubjectId == subjectId))
                    .ToList();


                return labs.Select(x =>
                {
                    var labJobProtection = jobProtections.FirstOrDefault(j => j.LabId == x.Id);
                    return new StudentJobProtection
                    {
                        IsReceived = labJobProtection?.IsReceived ?? false,
                        IsReturned = labJobProtection?.IsReturned ?? false,
                        LabId = x.Id,
                        StudentId = studentId,
                        Lab = x,
                        Student = student
                    };
                });

            }
        }

        public IEnumerable<GroupJobProtection> HasGroupsLabsJobProtection(int subjectId, IEnumerable<int> groupsIds)
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                return repositoriesContainer.ProtectionRepository.GetAll(
                    new Query<JobProtection>(x => x.Lab.SubjectId == subjectId && groupsIds.Contains(x.Student.GroupId)))
                    .Select(x => new GroupJobProtection { GroupId = x.Student.GroupId, HasJobProtection = !x.IsReceived && !x.IsReturned })
                    .ToList();
            }
        }

        public IEnumerable<GroupJobProtection> HasSubjectLabsJobProtection(int subjectId)
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                return repositoriesContainer.ProtectionRepository.GetAll(new Query<JobProtection>(x => x.Lab.SubjectId == subjectId))
                    .Select(x => new GroupJobProtection { GroupId = x.Student.GroupId, HasJobProtection = !x.IsReceived && !x.IsReturned })
                    .ToList();
            }

  
        }

        public void ReceiveLab(int labId, int studentId)
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                var jobProtection = repositoriesContainer.ProtectionRepository.GetLabJobProtection(labId, studentId);
                jobProtection.IsReceived = true;
                jobProtection.IsReturned = false;
                repositoriesContainer.ProtectionRepository.Save(jobProtection);
                repositoriesContainer.ApplyChanges();
            }
        }

        public void ReturnLab(int labId, int studentId)
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                var jobProtection = repositoriesContainer.ProtectionRepository.GetLabJobProtection(labId, studentId);
                jobProtection.IsReturned = true;
                jobProtection.IsReceived = false;
                repositoriesContainer.ProtectionRepository.Save(jobProtection);
                repositoriesContainer.ApplyChanges();
            }
        }
    }
}
