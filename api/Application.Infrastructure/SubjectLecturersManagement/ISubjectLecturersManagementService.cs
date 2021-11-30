using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Infrastructure.SubjectLecturersManagement
{
    public interface ISubjectLecturersManagementService
    {
        bool HasStudent(int lecturerId, int studentId);
    }
}
