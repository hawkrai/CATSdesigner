using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Core.Data;
using LMPlatform.Models;

namespace Application.Infrastructure.StudentManagement
{
    public interface IStudentManagementService
    {
        Student GetStudent(int userId, bool lite = false);

        List<Student> GetConfirmedAndNoneDeletedStudentsByGroup(int groupId);
        Task<Student> GetStudentAsync(int userId, bool lite = false);

        IEnumerable<Student> GetGroupStudents(int groupId);

        IEnumerable<Student> GetStudents(IQuery<Student> query = null);

        IPageableList<Student> GetStudentsPageable(string searchString = null, IPageInfo pageInfo = null, IEnumerable<ISortCriteria> sortCriterias = null);

        Task<IPageableList<Student>> GetStudentsPageableAsync(string searchString = null, IPageInfo pageInfo = null, ISortCriteria sortCriteria = null);

        Student Save(Student student);

        void UpdateStudent(Student student);

        Task RestoreStudentAsync(Student student);

        Task<bool> DeleteStudentAsync(int id);

        bool IsStudentActive(int userId);

	    int CountUnconfirmedStudents(int lecturerId);

	    void СonfirmationStudent(int studentId, int userId);

	    void UnConfirmationStudent(int studentId);

        void RemoveFromSubGroups(int studentId, int groupId);
    }
}