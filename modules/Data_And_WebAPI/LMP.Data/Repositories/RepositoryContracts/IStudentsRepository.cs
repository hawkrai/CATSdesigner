using System.Collections.Generic;
using Application.Core.Data;
using LMP.Models;

namespace LMP.Data.Repositories.RepositoryContracts
{
    public interface IStudentsRepository : IRepositoryBase<Student>
    {
        Student GetStudent(int id);

        List<Student> GetStudents(int groupId);

        List<Student> GetStudents();

        void SaveStudent(Student student);
    }
}