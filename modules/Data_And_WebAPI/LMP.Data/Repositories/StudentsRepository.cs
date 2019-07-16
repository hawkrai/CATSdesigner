using System.Collections.Generic;
using System.Linq;
using Application.Core.Data;
using LMP.Data.Infrastructure;
using LMP.Data.Repositories.RepositoryContracts;
using LMP.Models;
using Microsoft.EntityFrameworkCore;

namespace LMP.Data.Repositories
{
    public class StudentsRepository : RepositoryBase<LmPlatformModelsContext, Student>, IStudentsRepository
    {
        public StudentsRepository(LmPlatformModelsContext dataContext)
            : base(dataContext)
        {
        }

        public Student GetStudent(int id)
        {
            using (var context = new LmPlatformModelsContext())
            {
                var student = context.Set<Student>().Include(e => e.Group).FirstOrDefault(e => e.Id == id);
                return student;
            }
        }

        public List<Student> GetStudents(int groupId)
        {
            using (var context = new LmPlatformModelsContext())
            {
                var students = context.Set<Student>().Include(e => e.Group).Where(e => e.GroupId == groupId).ToList();
                return students;
            }
        }

        public List<Student> GetStudents()
        {
            using (var context = new LmPlatformModelsContext())
            {
                var students = context.Set<Student>().Include(e => e.Group).ToList();
                return students;
            }
        }

        public void SaveStudent(Student student)
        {
            using (var context = new LmPlatformModelsContext())
            {
               context.Set<Student>().Add(student);
                context.SaveChanges();
            }
        }
    }
}