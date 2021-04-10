using Application.Infrastructure.Models;
using LMPlatform.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Infrastructure.ProtectionManagement
{
    public interface IProtectionManagementService
    {
        void ReceiveLab(int labId, int studentId);

        void ReturnLab(int labId, int studentId);

        void CancelLab(int labId, int studentId);

        IEnumerable<IEnumerable<StudentJobProtection>> GetGroupLabsJobProtection(int subjectId, int groupId);

        IEnumerable<StudentJobProtection> GetStudentLabsJobProtection(int subjectId, int studentId);

        IEnumerable<GroupJobProtection> HasSubjectLabsJobProtection(int subjectId);

        IEnumerable<GroupJobProtection> HasGroupsLabsJobProtection(int subjectId, IEnumerable<int> groupsIds);

    }
}
