using System.Linq;
using LMP.Models;
using LMP.Models.CP;
using Microsoft.EntityFrameworkCore;

namespace LMP.Data.Infrastructure
{
    public interface ICpContext
    {
        #region DbSets

        DbSet<CourseProjectNews> CourseProjectNews { get; set; }

        DbSet<CourseProject> CourseProjects { get; set; }

        DbSet<Lecturer> Lecturers { get; set; }

        DbSet<AssignedCourseProject> AssignedCourseProjects { get; set; }

        DbSet<CourseProjectGroup> CourseProjectGroups { get; set; }

        DbSet<User> Users { get; set; }

        DbSet<Student> Students { get; set; }

        DbSet<CoursePercentagesGraph> CoursePercentagesGraphs { get; set; }

        DbSet<CoursePercentagesGraphToGroup> CoursePercentagesGraphToGroups { get; set; }

        DbSet<CoursePercentagesResult> CoursePercentagesResults { get; set; }

        DbSet<CourseProjectConsultationDate> CourseProjectConsultationDates { get; set; }

        DbSet<CourseProjectConsultationMark> CourseProjectConsultationMarks { get; set; }

        DbSet<CourseProjectTaskSheetTemplate> CourseProjectTaskSheetTemplates { get; set; }

        DbSet<Group> Groups { get; set; }
        
        #endregion

        IQueryable<Student> GetGraduateStudents();

        IQueryable<Group> GetGraduateGroups();

        int SaveChanges();
    }
}